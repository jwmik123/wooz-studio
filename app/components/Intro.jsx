const Intro = ({loading, progress, onEnter}) => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-green-300">
      {loading ? (
        <div className="flex flex-col">
          <p>Loading... {progress}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      ) : (
        <button onClick={onEnter}>Enter site</button>
      )}
    </div>
  );
};

export default Intro;
