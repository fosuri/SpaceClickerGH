import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "spaceRocketGameSave";

export default function App() {
  const [levels, setLevels] = useState(null);
  const [planet, setPlanet] = useState(1);
  const [currency, setCurrency] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [passengers, setPassengers] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [distance, setDistance] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [passengerCost, setPassengerCost] = useState(0);
  const [fuelCost1, setFuelCost1] = useState(0);
  const [fuelCost10, setFuelCost10] = useState(0);
  const [fuelCost100, setFuelCost100] = useState(0);
  const [currentTile, setCurrentTile] = useState(0);
  const [currentSkin, setCurrentSkin] = useState(1);
  const [currencyPerClick, setCurrencyPerClick] = useState(1);
  const [upgradeCost10, setUpgradeCost10] = useState(500);
  const [upgradeCost100, setUpgradeCost100] = useState(5000);
  const [upgradeCost1000, setUpgradeCost1000] = useState(20000);
  const [upgradeCount10, setUpgradeCount10] = useState(0);
  const [upgradeCount100, setUpgradeCount100] = useState(0);
  const [upgradeCount1000, setUpgradeCount1000] = useState(0);
  const [doubleDistanceCost, setDoubleDistanceCost] = useState(2000);
  const [isDoubleDistanceActive, setIsDoubleDistanceActive] = useState(false);
  const [doubleDistanceTimeLeft, setDoubleDistanceTimeLeft] = useState(0);
  const [planetImage, setPlanetImage] = useState("./Planets/PNG/exoplanet.png");

  // Загрузка уровней
  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => setLevels(data))
      .catch((err) => {
        console.error("Failed to load levels:", err);
        setLevels([]);
      });
  }, []);

  // Восстановление сохранения из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.planet) setPlanet(data.planet);
        if (data.currency) setCurrency(data.currency);
        if (data.fuel) setFuel(data.fuel);
        if (data.passengers) setPassengers(data.passengers);
        if (data.delivered) setDelivered(data.delivered);
        if (data.launched) setLaunched(data.launched);
        if (data.distance) setDistance(data.distance);
        if (data.isDoubleDistanceActive)
          setIsDoubleDistanceActive(data.isDoubleDistanceActive);
        if (data.doubleDistanceTimeLeft)
          setDoubleDistanceTimeLeft(data.doubleDistanceTimeLeft);
        if (data.currentSkin) setCurrentSkin(data.currentSkin);
        if (data.currencyPerClick) setCurrencyPerClick(data.currencyPerClick);
        if (data.upgradeCost10) setUpgradeCost10(data.upgradeCost10);
        if (data.upgradeCost100) setUpgradeCost100(data.upgradeCost100);
        if (data.upgradeCost1000) setUpgradeCost1000(data.upgradeCost1000);
        if (data.upgradeCount10) setUpgradeCount10(data.upgradeCount10);
        if (data.upgradeCount100) setUpgradeCount100(data.upgradeCount100);
        if (data.upgradeCount1000) setUpgradeCount1000(data.upgradeCount1000);
        if (data.gameOver) setGameOver(data.gameOver);
      } catch (e) {
        console.warn("Ошибка при восстановлении сохранения:", e);
      }
    }
  }, []);


  useEffect(() => {
    if (!levels) return;

    const saveData = {
      planet,
      currency,
      fuel,
      passengers,
      delivered,
      launched,
      distance,
      isDoubleDistanceActive,
      doubleDistanceTimeLeft,
      currentSkin,
      currencyPerClick,
      upgradeCost10,
      upgradeCost100,
      upgradeCost1000,
      upgradeCount10,
      upgradeCount100,
      upgradeCount1000,
      gameOver,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  }, [
    planet,
    currency,
    fuel,
    passengers,
    delivered,
    launched,
    distance,
    isDoubleDistanceActive,
    doubleDistanceTimeLeft,
    currentSkin,
    currencyPerClick,
    upgradeCost10,
    upgradeCost100,
    upgradeCost1000,
    upgradeCount10,
    upgradeCount100,
    upgradeCount1000,
    gameOver,
    levels,
  ]);

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => setLevels(data))
      .catch((err) => {
        console.error("Failed to load levels:", err);
        setLevels([]);
      });
  }, []);

  useEffect(() => {
    if (!isDoubleDistanceActive || !launched) return;

    if (doubleDistanceTimeLeft <= 0) {
      setIsDoubleDistanceActive(false);
      setDoubleDistanceTimeLeft(0);
      return;
    }

    const timerId = setInterval(() => {
      setDoubleDistanceTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isDoubleDistanceActive, doubleDistanceTimeLeft, launched]);

  const currentLevel = levels
    ? levels.find((lvl) => lvl.levelId === planet)
    : null;

  useEffect(() => {
    if (currentLevel) {
      setPassengerCost(currentLevel.defaultPassengerCost);
      setFuelCost1(currentLevel.defaultFuelCost);
      setFuelCost10(currentLevel.defaultFuelCost * 10);
      setFuelCost100(currentLevel.defaultFuelCost * 100);
    }
  }, [currentLevel]);

  const GOAL_PER_PLANET = currentLevel?.passengerGoal || 1000;
  const DISTANCE_TO_FINISH = currentLevel?.distance || 3000;

  const getRandom = (min, max, rarityCurve) => {
    const rand = Math.random();
    const skewedRand = Math.pow(rand, 1 / rarityCurve);
    return Math.floor(min + skewedRand * (max - min));
  };

  const DISTANCE_PER_CLICK = getRandom(10, 1130, 1); //fosback

  const playTileAnimation = () => {
    const frames = [1, 2, 0];
    let i = 0;

    const interval = setInterval(() => {
      setCurrentTile(frames[i]);
      i++;
      if (i >= frames.length) {
        clearInterval(interval);
        setCurrentTile(0);
      }
    }, 75); // delay (in ms)) per frame (best between 30ms - 100ms)
  };

  useEffect(() => {
    const onKeyUp = (e) => {
      if (
        e.code === "Space" ||
        e.key === " " ||
        e.key === "Spacebar" ||
        e.key.toLowerCase() === "z" ||
        e.key.toLowerCase() === "x"
      ) {
        e.preventDefault();

        if (launched && !isFinishing && fuel > 0) {
          setDistance((d) =>
            Math.min(
              d + DISTANCE_PER_CLICK * (isDoubleDistanceActive ? 2 : 1),
              DISTANCE_TO_FINISH
            )
          );
          setFuel((prev) => Math.max(prev - getRandom(2, 8, 3), 0));
        } else if (!launched) {
          setCurrency((c) => c + currencyPerClick);
          playTileAnimation();
        }
      }
    };

    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [launched, isFinishing, fuel, DISTANCE_PER_CLICK, DISTANCE_TO_FINISH]);

  useEffect(() => {
    if (launched && distance >= DISTANCE_TO_FINISH && !isFinishing) {
      setIsFinishing(true);
      setDistance(DISTANCE_TO_FINISH);
      setTimeout(() => {
        setLaunched(false);
        setDelivered((d) => d + passengers);
        setPassengers(0);
        setIsFinishing(false);
        setDistance(0);
      }, 2000);
    }
  }, [distance, launched, passengers, isFinishing, DISTANCE_TO_FINISH]);

  useEffect(() => {
    if (launched && fuel <= 0 && !isFinishing) {
      setIsFinishing(true);
      setTimeout(() => {
        setLaunched(false);
        setPassengers(0);
        // setFuelCost(currentLevel.defaultFuelCost);
        setIsFinishing(false);
        setDistance(0);
      }, 2000);
    }
  }, [fuel, launched, isFinishing]);

  useEffect(() => {
    if (delivered >= GOAL_PER_PLANET) {
      
      setIsFinishing(true); 

      setTimeout(() => {
        if (planet < (levels?.length || 0)) {
         
          setPlanet((p) => p + 1);
          setDelivered(0);
          setIsFinishing(false); 
        } else {
          setLaunched(false);
          setGameOver(true);
        }
      }, 1000); // animation delay
    }
  }, [delivered, planet, GOAL_PER_PLANET, levels]);

  const buyPassenger = (amount) => {
    if (currency >= passengerCost && !launched && currentLevel) {
      setCurrency((c) => c - passengerCost * amount);
      setPassengers((prev) => prev + amount);
      setPassengerCost(
        Math.floor(passengerCost * currentLevel.passengerCostMultiplier)
      );
    }
  };

  const buyFuel = (amount) => {
    if (!currentLevel) return;

    let cost = 0;
    let setCost;

    if (amount === 10) {
      cost = fuelCost1;
      setCost = setFuelCost1;
    } else if (amount === 100) {
      cost = fuelCost10;
      setCost = setFuelCost10;
    } else if (amount === 250) {
      cost = fuelCost100;
      setCost = setFuelCost100;
    }

    if (currency >= cost) {
      setCurrency((prev) => prev - cost);
      setFuel((prev) => prev + amount);
      setCost((prev) =>
        Math.floor(prev + (currentLevel.defaultFuelCost * amount) / 2)
      );
    }
  };

  const launchRocket = () => {
    if (passengers > 0 && !launched && fuel > 0) {
      setLaunched(true);
      setDistance(0);
      setPassengerCost(currentLevel.defaultPassengerCost);
    }
  };

  const resetGame = () => {
    setCurrency(0);
    setFuel(0);
    setPassengers(0);
    setDelivered(0);
    setPlanet(1);
    setLaunched(false);
    setDistance(0);
    setIsFinishing(false);
    setGameOver(false);
    setUpgradeCount10(0)
    setUpgradeCount100(0)
    setUpgradeCount1000(0)
    setUpgradeCost10(500)
    setUpgradeCost100(5000)
    setUpgradeCost1000(20000)
    setCurrentSkin(1)
    setCurrencyPerClick(1)
    setPlanetImage("./Planets/PNG/exoplanet.png")
    if (levels?.length) {
      setPassengerCost(levels[0].defaultPassengerCost);
      setFuelCost1(levels[0].defaultFuelCost);
      setFuelCost10(levels[0].defaultFuelCost*10);
      setFuelCost100(levels[0].defaultFuelCost*100);
    }
  };

  useEffect(() => {
    if (levels && planet > 1) {
      const previousLevel = levels[planet - 2];
      setPlanetImage(previousLevel?.image || "./Planets/PNG/exoplanet.png");
    }
  }, [planet, levels]);

  const PLANET_APPEAR_THRESHOLD = DISTANCE_TO_FINISH * 0.46;
  const planetProgress = Math.max(
    0,
    (distance - PLANET_APPEAR_THRESHOLD) / PLANET_APPEAR_THRESHOLD
  );
  const planetY = -400 + planetProgress * 500;
  const planetOpacity = planetProgress > 0 ? 1 : 0;
  const planetScale = 0.5 + planetProgress * 0.5;

  if (!levels) {
    return <div style={{ color: "white" }}>Загрузка уровней...</div>;
  }
  if (!currentLevel) {
    return <div style={{ color: "white" }}>Уровень не найден</div>;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        background: "black",
      }}
    >
      <motion.div
        animate={{ opacity: isFinishing ? 0 : 1 }}
        transition={{ duration: 1 }}
        style={{
          textAlign: "center",
          fontSize: 30,
          marginTop: 50,
          color: "white",
        }}
      >
        {isFinishing ? "Завершаем уровень..." : `Уровень ${planet}`}
      </motion.div>

      <motion.div
        animate={{
          backgroundPositionY: launched ? ["0%", "900%"] : ["0%", "50%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 80px 120px, white, transparent),
            radial-gradient(2px 2px at 200px 50px, white, transparent),
            radial-gradient(2px 2px at 300px 150px, white, transparent),
            radial-gradient(2px 2px at 400px 80px, white, transparent),
            radial-gradient(2px 2px at 100px 200px, white, transparent),
            radial-gradient(2px 2px at 250px 300px, white, transparent),
            radial-gradient(2px 2px at 350px 350px, white, transparent)
          `,
          backgroundSize: "400px 200px",
          zIndex: 0,
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        {launched && !gameOver && currentLevel?.image && (
          <motion.div
            initial={{ y: -400, opacity: 0, scale: 0.5 }}
            animate={{
              y: planetY,
              opacity: planetOpacity,
              scale: planetScale,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
            style={{
              width: 250, // control planet width
              height: 250, // control planet height
              zIndex: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={currentLevel.image}
              alt={currentLevel.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </motion.div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <motion.div
          animate={{ y: launched ? 0 : [0, -5, 0] }}
          transition={{
            duration: launched ? 0.2 : 1.5,
            repeat: launched ? 0 : Infinity,
          }}
          style={{
            width: launched ? 100 : 300,
            height: launched ? 100 : 300,
            zIndex: 2,
            overflow: "hidden",
          }}
        >
          <img
            src={launched ? `./big rocket/svg/skins/${currentSkin}/rockewfire.svg` : `./big rocket/svg/skins/${currentSkin}/tile00${currentTile}.svg`}
            alt="Rocket"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </motion.div>
      </div>

      <div className="minimapDIV">
        <img src={planetImage} alt={`Planet ${planet}`} style={{ width: "100%", height: "100%" }} />
        <p>Текущая планета</p>
      </div>

      {!launched &&(
        
      <div className="devDIV" style={{color: "white", zIndex:"99" }}>
        <h3>Test tools</h3>

        <div style={{ marginBottom: "10px" }}>
          <input type="number" placeholder="+currency" id="devCurrencyInput" style={{ width: "100px", marginRight: "10px" }} />
          <button
            onClick={() => {
              const val = parseInt(document.getElementById("devCurrencyInput").value || 0);
              if (!isNaN(val)) setCurrency((c) => c + val);
            }}
          >
            +add
          </button>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input type="number" placeholder="+passengers" id="devPassengerInput" style={{ width: "100px", marginRight: "10px" }} />
          <button
            onClick={() => {
              const val = parseInt(document.getElementById("devPassengerInput").value || 0);
              if (!isNaN(val)) setPassengers((p) => p + val);
            }}
          >
            +add
          </button>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input type="number" placeholder="level" id="devLevelInput" style={{ width: "100px", marginRight: "10px" }} />
          <button
            onClick={() => {
              const val = parseInt(document.getElementById("devLevelInput").value || 0);
              if (!isNaN(val) && levels && val >= 1 && val <= levels.length) {
                setPlanet(val);
                setDelivered(0);
              }
            }}
          >
            switch
          </button>
        </div>
      </div>
      )}

      <div
        className="UI controls"
        style={{
          position: "relative",
          zIndex: 3,
          background: "rgba(0,0,0,0.6)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          color: "white",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h2>
          Уровень {planet} - Цель: {GOAL_PER_PLANET} пассажиров
        </h2>
        <p>
          🚀Доставлено: {delivered} / {GOAL_PER_PLANET}
        </p>
        <p>💵Валюта: {currency}</p>
        <p>🧑‍🚀Пассажиры: {passengers}</p>
        <p>⛽Топливо: {fuel}</p>
        <p>
          📍Пройдено: {distance} / {DISTANCE_TO_FINISH}
        </p>

        {!launched && (
          <div
            className="Skin-items"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              position: "absolute",
              bottom: 0,
            }}
          >
            <h3>Выберите облик</h3>
            {[1, 2, 3, 4, 5].map((skinNumber) => (
              <div className="Skin-item" key={skinNumber} onClick={() => setCurrentSkin(skinNumber)} style={{ width: 70, height: 70 }}>
                <img
                  src={`./big rocket/svg/skins/${skinNumber}/rockewfire.svg`}
                  alt={`Rocket Skin ${skinNumber}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {!launched && (
          <div className="upgradesDIV">
            <div
              className="upgrades-label-div"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3 className="upgrades-label-h3" style={{ rotate: "-90deg", margin: "0" }}>
                Улучшения
              </h3>
            </div>
            <div className="upgrades-items">
              <div className="upgrades-item">
                <p>Улучшение: +10 за клик</p>
                <button
                  onClick={() => {
                    if (currency >= upgradeCost10) {
                      setCurrency((c) => c - upgradeCost10);
                      setCurrencyPerClick((c) => c + 10);
                      setUpgradeCost10((cost) => Math.floor(cost * 1.5));
                      setUpgradeCount10((count) => count + 1);
                    }
                  }}
                  disabled={currency < upgradeCost10}
                >
                  💵{upgradeCost10}
                </button>
                <div className="upgrades-info">
                  <i>Куплено: {upgradeCount10}</i>
                  <i>Дает +{upgradeCount10 * 10}</i>
                </div>
              </div>

              <div className="upgrades-item">
                <p>Улучшение: +100 за клик</p>
                <button
                  onClick={() => {
                    if (currency >= upgradeCost100) {
                      setCurrency((c) => c - upgradeCost100);
                      setCurrencyPerClick((c) => c + 10);
                      setUpgradeCost100((cost) => Math.floor(cost * 1.5));
                      setUpgradeCount100((count) => count + 1);
                    }
                  }}
                  disabled={currency < upgradeCost100}
                >
                  💵{upgradeCost100}
                </button>
                <div className="upgrades-info">
                  <i>Куплено: {upgradeCount100}</i>
                  <i>Дает +{upgradeCount100 * 100}</i>
                </div>
              </div>

              <div className="upgrades-item">
                <p>Улучшение: +1000 за клик</p>
                <button
                  onClick={() => {
                    if (currency >= upgradeCost1000) {
                      setCurrency((c) => c - upgradeCost1000);
                      setCurrencyPerClick((c) => c + 10);
                      setUpgradeCost1000((cost) => Math.floor(cost * 1.5));
                      setUpgradeCount1000((count) => count + 1);
                    }
                  }}
                  disabled={currency < upgradeCost1000}
                >
                  💵{upgradeCost1000}
                </button>
                <div className="upgrades-info">
                  <i>Куплено: {upgradeCount1000}</i>
                  <i>Дает +{upgradeCount1000 * 1000}</i>
                </div>
              </div>

              <div className="upgrades-item">
                <p>Временное улучшение: дистанция X2 (30 секунд)</p>
                <button
                  onClick={() => {
                    if (currency >= doubleDistanceCost && !isDoubleDistanceActive) {
                      setCurrency((c) => c - doubleDistanceCost);
                      setIsDoubleDistanceActive(true);
                      setDoubleDistanceTimeLeft(30); // Стартуем с 30 секунд
                    }
                  }}
                  disabled={currency < doubleDistanceCost || isDoubleDistanceActive}
                >
                  💵{doubleDistanceCost}
                </button>
                <div className="upgrades-info">{isDoubleDistanceActive ? <i>Активно!</i> : <i>Активировать X2 дистанцию на 30 секунд</i>}</div>
              </div>
            </div>
          </div>
        )}

        {!launched && !gameOver && (
          <div className="buyButtons">
            <div className="passengerButtons">
              <button onClick={() => buyPassenger(1)} disabled={currency < passengerCost || passengers == GOAL_PER_PLANET}>
                🧑‍🚀(+1) за {passengerCost}$
              </button>
              <button onClick={() => buyPassenger(10)} disabled={currency < passengerCost * 10 || passengers == GOAL_PER_PLANET}>
                🧑‍🚀(+10) за {passengerCost * 10}$
              </button>
              <button onClick={() => buyPassenger(100)} disabled={currency < passengerCost * 100 || passengers == GOAL_PER_PLANET}>
                🧑‍🚀(+100) за {passengerCost * 100}$
              </button>
            </div>
            <div className=" fuelButtons">
              <button onClick={() => buyFuel(10)} disabled={currency < fuelCost1}>
                ⛽(+10) за {fuelCost1}$
              </button>
              <button onClick={() => buyFuel(100)} disabled={currency < fuelCost10}>
                ⛽(+100) за {fuelCost10}$
              </button>
              <button onClick={() => buyFuel(250)} disabled={currency < fuelCost100}>
                ⛽(+250) за {fuelCost100}$
              </button>
            </div>
          </div>
        )}
        {!launched && (
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
            <button className="launchButton" onClick={launchRocket} disabled={passengers <= 0 || fuel <= 0}>
              Запустить ракету
            </button>

            <button
              className="resetButton"
              style={{ color: "#fff" }}
              onClick={() => {
                resetGame();
                localStorage.removeItem(STORAGE_KEY);
              }}
            >
              🔄 Перезапустить игру
            </button>
          </div>
        )}

        {launched && (
          <p style={{ marginTop: 10, fontStyle: "italic" }}>
            Нажимай <b>Пробел</b>, чтобы продвигаться вперед!
          </p>
        )}

        {gameOver && (
          <>
            <h3>Игра окончена! Поздравляем!</h3>
            <button onClick={resetGame}>Начать заново</button>
          </>
        )}
      </div>
    </div>
  );
}
