import TetrisBoard from './TetrisBoard';
const TetrisGame=()=> {
  return (
    <div className='w-full h-screen flex space-between text-white bg-gray-900'>
      <button>Iniciar juego</button>
      <TetrisBoard></TetrisBoard>
      <div>Tabla de puntuaciones</div>
    </div>
  )
}

export default TetrisGame