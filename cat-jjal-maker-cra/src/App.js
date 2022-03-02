// import logo from './logo.svg';
import React from 'react';
import Title from './components/Title';
import './App.css';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(
    `${OPEN_API_DOMAIN}/cat/says/${text}?json=true`
  );
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;

    setErrorMessage("");
    includesHangul(userValue)
      ? setErrorMessage("한글은 입력할 수 없습니다.")
      : setErrorMessage("");

    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");

      return; //함수가 updateMainCat() 까지 불리우지 않고 끝날 수 있게 처리
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성2</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <p>사진 위 하트를 눌러 고양이 사진을 저장해 보아요!</p>;
  }
  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

function CatItem({ img }) {
  return (
    <li>
      <img src={img} style={{ width: "150px" }} />
    </li>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const App = () => {
  const CAT1 =
    "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 =
    "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  // 처음 한 번만 접근하게 하기(불필요하게 로컬스토리지에 계속 접근할 필요가 X)
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCat, setmainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  }); //null이면 빈 배열을 넣어주기

  const alreadyFavorite = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setmainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  React.useEffect(() => {
    console.log("hello"); //app이 UI를 새로 그릴 때마다 찍힘
  }, [counter]); //함수가 불리는 순간들을 제한 -> 두번째 배열 부분

  console.log("COUNTER:", counter);
  console.log("IMAGE:", mainCat);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setmainCat(newCat);
    // setCounter(nextCounter); //setcounter, counter가 없으니까 props로 넘겨줘야 함
    setCounter ((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    })
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};


export default App;
