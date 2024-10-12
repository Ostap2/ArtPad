import React, { useRef, useEffect, useState } from 'react';

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('default');
  const [lines, setLines] = useState<{ points: { x: number; y: number }[]; color: string }[]>([]);
  const [shapePoints, setShapePoints] = useState<{ x: number; y: number; shape: string }[]>([]); // New state for shapes

  const startDrawing = (e: MouseEvent) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Start a new line with the current selected color
    const newLine = { points: [{ x, y }], color: getColor(selectedMode) };
    setLines((prevLines) => [...prevLines, newLine]);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add point to the current line
    setLines((prevLines) => {
      const newLines = [...prevLines];
      const currentLine = newLines[newLines.length - 1];
      currentLine.points.push({ x, y });
      return newLines;
    });

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const getColor = (mode: string) => {
    switch (mode) {
      case 'red':
        return 'red';
      case 'blue':
        return 'blue';
      case 'green':
        return 'green';
      case 'dashed':
        return 'black'; // Dashed lines will use black color
      case 'circle':
        return 'orange';
      case 'square':
        return 'purple';
      default:
        return 'black';
    }
  };

  const drawShape = (ctx: CanvasRenderingContext2D, shape: string, x: number, y: number) => {
    ctx.fillStyle = getColor(selectedMode);
    ctx.beginPath();
    switch (shape) {
      case 'circle':
        ctx.arc(x, y, 10, 0, Math.PI * 2); // Draw a circle
        ctx.fill();
        break;
      case 'square':
        ctx.rect(x - 10, y - 10, 20, 20); // Draw a square
        ctx.fill();
        break;
      default:
        break;
    }
  };

  const redraw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw all existing lines
    lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.color === 'dashed' ? 1 : 2;
      ctx.setLineDash(line.color === 'dashed' ? [5, 5] : []);
      ctx.beginPath();
      line.points.forEach((point, index) => {
        index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    // Draw shapes only for the latest shape drawn
    if (shapePoints.length > 0) {
      shapePoints.forEach((point) => {
        drawShape(ctx, point.shape, point.x, point.y);
      });
    }
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    if (mode === 'circle' || mode === 'square') {
      setShapePoints([]); // Clear previous shapes when changing to shape mode
    }
  };

  const clearCanvas = () => {
    setLines([]);
    setShapePoints([]); // Clear shapes when the canvas is cleared
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 600;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    redraw();

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [isDrawing, lines, shapePoints, selectedMode]);

  // Capture shapes on click when circle or square mode is active
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedMode === 'circle' || selectedMode === 'square') {
      const ctx = canvasRef.current?.getContext('2d');
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newShapePoint = { x, y, shape: selectedMode };
      setShapePoints((prev) => [...prev, newShapePoint]); // Add the shape point to the state

      drawShape(ctx!, selectedMode, x, y); // Draw the shape immediately
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '600px' }}>
      <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
        <h2>Вибір режиму</h2>
        <button onClick={() => handleModeChange('default')}>Стандартний</button>
        <button onClick={() => handleModeChange('red')}>Червоний</button>
        <button onClick={() => handleModeChange('blue')}>Синій</button>
        <button onClick={() => handleModeChange('green')}>Зелений</button>
        <button onClick={() => handleModeChange('circle')}>Коло</button>
        <button onClick={() => handleModeChange('square')}>Квадрат</button>
        <button onClick={clearCanvas}>Очистити</button>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{ border: '1px solid black' }}
          onClick={handleCanvasClick} // Add click event for shapes
        />
      </div>
    </div>
  );
};

export default GamePage;
