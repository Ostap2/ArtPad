import React, { useRef, useEffect, useState } from 'react';

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('default'); // Для збереження вибраного режиму
  const [lines, setLines] = useState<{ points: { x: number; y: number }[]; color: string }[]>([]); // Для збереження ліній

  const startDrawing = (e: MouseEvent) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Додаємо нову лінію з першою точкою
    setLines((prevLines) => [
      ...prevLines,
      { points: [{ x, y }], color: selectedMode === 'red' ? 'red' : 'black' },
    ]);

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

    // Додаємо точку до останньої лінії
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
    ctx?.beginPath(); // Скидаємо шлях
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Встановлюємо фіксовані розміри для канваса
    canvas.width = 900; // Фіксована ширина
    canvas.height = 600; // Фіксована висота

    // Додаємо обробники подій для малювання
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Малюємо всі лінії при завантаженні
    redraw();

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [isDrawing, selectedMode, lines]); // Додаємо lines в залежності

  const redraw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Очищаємо канвас

    // Перемальовуємо всі лінії
    lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      line.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode); // Оновлюємо вибраний режим
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '600px' }}> {/* Батьківський контейнер з флексом */}
      {/* Сайдбар */}
      <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
        <h2>Вибір режиму</h2>
        <button onClick={() => handleModeChange('default')}>Стандартний</button>
        <button onClick={() => handleModeChange('red')}>Червоний</button>
        {/* Додайте інші кнопки для режимів тут */}
      </div>

      {/* Канвас */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Центруємо канвас */}
        <canvas
          ref={canvasRef}
          style={{ border: '1px solid black' }} // Тільки рамка
        />
      </div>
    </div>
  );
};

export default GamePage;
