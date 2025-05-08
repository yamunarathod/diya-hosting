import React, { useState, useEffect, useRef } from 'react';
import './styles/DisplayComponent.css';
import { supabase } from './supabaseClient';
import { io } from 'socket.io-client';
import { GRID_SIZE, CELL_COUNT, findEmptyGridIndex } from './utils/diyaUtils';

// Grid setup
const MAX_ROWS = 10;
const CELL_WIDTH = window.innerWidth / GRID_SIZE;
const CELL_HEIGHT = window.innerHeight / MAX_ROWS;
const ITEM_SIZE = Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.75;
const VERTICAL_OFFSET = 5;
const ANIMATION_DURATION = 2000; // 2 seconds for newEntryPopup

function DisplayComponent() {
  const gifSrc = '/assets/Diya.webm';
  const [names, setNames] = useState([]);
  const [gridState, setGridState] = useState({
    items: Array(CELL_COUNT).fill(null),
    usedCells: new Set(),
  });
  const [collecting, setCollecting] = useState(false);
  const [isRevealingLogo, setIsRevealingLogo] = useState(false);
  const [animatingItems, setAnimatingItems] = useState({}); // { key: startTime }

  const hasSubscribed = useRef(false);
  const processedIds = useRef(new Set());

  // Socket.IO setup
  useEffect(() => {
    const socket = io('https://coral-app-6iasr.ondigitalocean.app/');
    socket.on('reveal', () => {
      console.log('Reveal triggered via socket');
      setCollecting(true);
      setTimeout(() => {
        setIsRevealingLogo(true);
      }, 3600);
    });
    socket.on('submission', (data) => {
      console.log('Received submission via socket:', data);
    });
    return () => socket.disconnect();
  }, []);

  // BroadcastChannel setup
  useEffect(() => {
    const channel = new BroadcastChannel('diya-reveal');
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'REVEAL_DIYA') {
        console.log('Reveal triggered via BroadcastChannel');
        setCollecting(true);
        setTimeout(() => {
          setIsRevealingLogo(true);
        }, 3600);
      }
    };
    return () => channel.close();
  }, []);

  // Fetch initial names
  useEffect(() => {
    const fetchNames = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching names:', error);
        return;
      }

      const nameList = data.map((item) => ({ id: item.id, name: item.name }));
      console.log('Fetched initial names:', nameList);
      setNames(nameList);

      const updatedGrid = Array(CELL_COUNT).fill(null);
      const updatedUsedCells = new Set();

      nameList.forEach(({ name }) => {
        const index = findEmptyGridIndex(updatedUsedCells);
        if (index !== null) {
          updatedGrid[index] = name;
          updatedUsedCells.add(index);
        }
      });

      setGridState({ items: updatedGrid, usedCells: updatedUsedCells });
    };

    fetchNames();
  }, []);

  // Real-time Supabase subscription
  useEffect(() => {
    if (hasSubscribed.current) return;

    console.log('Setting up Supabase real-time subscription');
    const channel = supabase
      .channel('submissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submissions',
        },
        (payload) => {
          const newEntry = payload.new;
          const submissionId = newEntry?.id;
          const newName = newEntry?.name;

          if (!submissionId || !newName) {
            console.log('Invalid submission:', { submissionId, newName });
            return;
          }

          if (processedIds.current.has(submissionId)) {
            console.log('Skipping duplicate submission:', { submissionId, newName });
            return;
          }

          processedIds.current.add(submissionId);
          console.log('📡 New submission received:', { submissionId, newName });

          handleNewName(newName);
        }
      )
      .subscribe((status) => {
        console.log('Supabase subscription status:', status);
        if (status === 'SUBSCRIBED') {
          hasSubscribed.current = true;
        }
      });

    return () => {
      console.log('Removing Supabase channel');
      supabase.removeChannel(channel);
      hasSubscribed.current = false;
    };
  }, []);

  // Handle new name arrival (direct grid placement)
  const handleNewName = (newName) => {
    let newIndex = null;
    setGridState((prevState) => {
      const updatedGrid = [...prevState.items];
      const usedIndices = new Set(prevState.usedCells);

      newIndex = findEmptyGridIndex(usedIndices);
      if (newIndex !== null) {
        updatedGrid[newIndex] = newName;
        usedIndices.add(newIndex);
        setAnimatingItems((prev) => ({
          ...prev,
          [`${newName}-${newIndex}`]: Date.now(),
        }));
      }

      return { items: updatedGrid, usedCells: usedIndices };
    });

    // Remove the item from animatingItems after the animation duration
    if (newIndex !== null) {
      setTimeout(() => {
        setAnimatingItems((prev) => {
          const updated = { ...prev };
          delete updated[`${newName}-${newIndex}`];
          return updated;
        });
      }, ANIMATION_DURATION);
    }
  };

  // Component render logic
  if (isRevealingLogo) {
    return (
      <div className="logo-reveal-container">
        <video
          src="/assets/logoreveal.mp4"
          autoPlay
          muted
          playsInline
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div className="free-floating-container">
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/BG.mp4" type="video/mp4" />
      </video>
      {/* Grid Items */}
      {gridState.items.map((name, index) => {
        if (!name) return null;

        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;

        if (row >= MAX_ROWS) return null;
        const left = col * CELL_WIDTH + (CELL_WIDTH - ITEM_SIZE) / 2;
        const top = row * CELL_HEIGHT + (CELL_HEIGHT - ITEM_SIZE) / 2 + VERTICAL_OFFSET;

        // Determine animation based on whether the item is animating
        const key = `${name}-${index}`;
        const startTime = animatingItems[key];
        const isAnimating = startTime && Date.now() - startTime < ANIMATION_DURATION;
        let animation = 'none';
        if (isAnimating) {
          animation = `newEntryPopup 2s ease-in-out 0s`;
        } else if (Math.random() < 0.3) { // 30% chance to animate existing items
          animation = `persistentPulse 3s ease-in-out 0s infinite`;
        }

        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: collecting ? '50vw' : `${left}px`,
              top: collecting ? '50vh' : `${top}px`,
              width: ITEM_SIZE,
              pointerEvents: 'none',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transform: collecting ? 'translate(-50%, -50%) scale(1.2)' : undefined,
              transition: 'left 3.5s cubic-bezier(0.23, 1, 0.32, 1), top 3.5s cubic-bezier(0.23, 1, 0.32, 1)',
              animation,
            }}
          >
            <video
              src={gifSrc}
              style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                display: 'block',
                margin: '0 auto',
              }}
              autoPlay
              loop
              muted
              playsInline
            />
            <h3
              style={{
                color: '#fff',
                margin: '0px 0px 10px 0px',
                fontSize: 'clamp(12px, 0.5vw, 8px)',
                textShadow: '0 0 10px #000, 0 0 20px #222',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '7ch',
              }}
            >
              {name}
            </h3>
          </div>
        );
      })}
    </div>
  );
}

export default DisplayComponent;