import AppRouter from "./app/AppRouter";
import "./index.css";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="app-frame">
      {/* <h1>Chozy 웹 배포</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>vercel 사용 배포 테스트</p>
      </div> */}
      <AppRouter />
    </div>
  );
}

export default App;
