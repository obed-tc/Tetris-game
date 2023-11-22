import React, { useEffect,useState, useRef } from 'react';

const TetrisBoard = () => {
  const canvasRef = useRef(null);

  // Ejemplo de un array 2D para representar el estado del tablero (0 para celdas vacías, 1 para celdas ocupadas)
    const [tetrisBoard, setTetrisBoard] = useState([
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0, 0, 1, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,1],

  ]);
  const [currentPiece, setCurrentPiece] = useState({
    shape: [
        [1, 1,1], 
        [0, 1,0]
    ], // Ejemplo de pieza cuadrada
    position: { x: 7, y: 0 }, // Posición inicial de la pieza
  });

  const cellSize = 15;
  const drawBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el tablero
    for (let row = 0; row < tetrisBoard.length; row++) {
      for (let col = 0; col < tetrisBoard[row].length; col++) {
        const cellValue = tetrisBoard[row][col];
        ctx.fillStyle = cellValue === 1 ? 'yellow' : 'black';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.strokeStyle = 'transparent';
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }

    // Dibujar la pieza actual
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        const cellValue = currentPiece.shape[row][col];
        if (cellValue === 1) {
          const x = currentPiece.position.x + col;
          const y = currentPiece.position.y + row;
          ctx.fillStyle = 'yellow';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  };
  
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        movePieceLeft();
        break;
      case 'ArrowRight':
        movePieceRight();
        break;
      case 'ArrowDown':
        movePieceDown();
        break;
      default:
        break;
    }
  };
  const movePieceDown = () => {
    setCurrentPiece((prevPiece) => ({
      ...prevPiece,
      position: { ...prevPiece.position, y: prevPiece.position.y + 1 },
    }));
      
  };

  const movePieceLeft = () => {
    setCurrentPiece((prevPiece) => ({
      ...prevPiece,
      position: { ...prevPiece.position, x: prevPiece.position.x - 1 },
    }));
  };

  const movePieceRight = () => {
    setCurrentPiece((prevPiece) => ({
      ...prevPiece,
      position: { ...prevPiece.position, x: prevPiece.position.x + 1 },
    }));
  };
  const handleCollision = (newPiecePosition) => {
    const newTetrisBoard = tetrisBoard.map((row, rowIndex) =>
      rowIndex < newPiecePosition.y || rowIndex >= newPiecePosition.y + currentPiece.shape.length
        ? [...row] // Copia las filas que no están afectadas por la nueva pieza
        : row.map((cell, colIndex) =>
            colIndex >= newPiecePosition.x && colIndex < newPiecePosition.x + currentPiece.shape[0].length
              ? currentPiece.shape[rowIndex - newPiecePosition.y][colIndex - newPiecePosition.x] || cell
              : cell
          )
    );
  
    setTetrisBoard(newTetrisBoard);
    setCurrentPiece(getRandomPiece());
  };

  const checkCollision = (piece, position, board) => {
    return piece.shape.some((row, rowIndex) =>
      row.some((cell, colIndex) => {
        if (cell) {
          const boardRow = position.y + rowIndex+1;
          const boardCol = position.x + colIndex;
          // Verificar colisiones con el borde inferior o celdas fijas en el tablero
          if (
            boardRow >= board.length ||
            board[boardRow][boardCol]
          ) {
            return true;
          }
        }
        return false;
      })
    );
  };
  const getRandomPiece = () => {
    const pieces = [
      {
        shape: [
          [1, 1, 1],
          [0, 1, 0]
        ],
      },
      {
        shape: [
          [1, 1],
          [1, 1]
        ],
      },
      // ... Agrega más tipos de piezas según tus necesidades
    ];
  
    const randomPieceIndex = Math.floor(Math.random() * pieces.length);
    const newPiece = pieces[randomPieceIndex];
  
    // Posición inicial aleatoria en la parte superior del tablero
    const initialPosition = {
      x: Math.floor(Math.random() * (tetrisBoard[0].length - newPiece.shape[0].length + 1)),
      y: 0,
    };
  
    return { shape: newPiece.shape, position: initialPosition };
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newPiecePosition = {
        ...currentPiece.position,
        y: currentPiece.position.y + 1,
      };

      // Verificar colisiones con el tablero
      const pieceCollides = checkCollision(currentPiece, newPiecePosition, tetrisBoard);

      if (!pieceCollides) {
        setCurrentPiece((prevPiece) => ({
          ...prevPiece,
          position: newPiecePosition,
        }));
      } else {
        handleCollision(newPiecePosition);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [tetrisBoard, currentPiece]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    drawBoard();
    
    
  }, [tetrisBoard, currentPiece]);
  
  
  return <canvas ref={canvasRef} width={270} height={300} className="border-2 border-gray-800"></canvas>;
};

export default TetrisBoard;


