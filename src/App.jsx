import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios, { all } from "axios";
import PokeCard from "./components/PokeCard.jsx";
import { useDebounce } from "./hooks/useDebounce.js";
import AutoComplete from "./components/AutoComplete.jsx";

const App = () => {
  
	//모든 포켓몬의 데이털르 가지고 있는 state
	const [allpokemons, setAllpokemons] = useState([]);
	//실제로 리스트를 보여주는 데이터를 가지고 있는 state
	const [displayedPokemons, setDisplayedPokemons] = useState([]);

	//한번에 보여줄 데이터수
	const limitNum = 20;
	const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;


	useEffect(() => {
		fetchPokeData();
	}, []);


	const filterDisplayedPokemonData = (
		allpokemons,
		displayedPokemons = []
	) => {
		const limit = displayedPokemons.length + limitNum;

		//모든 포켓몬 데이터에서 limitNum만큼 가져오기
		const array = allpokemons.filter(
			(pokemon, index) => index + 1 <= limit
		);

		return array;
	};

	const fetchPokeData = async () => {
		try {
			const response = await axios.get(url);

			//모든 포켓몬 데이터 기억
			setAllpokemons(response.data.results);

			//실제로 화면에 보여줄 포켓몬 리스트 기억하는 state
			setDisplayedPokemons(
				filterDisplayedPokemonData(response.data.results)
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<article className="pt-6">
			<header className="flex flex-col gap-2 w-full px-4 z-50">
				<AutoComplete
					allpokemons={allpokemons}
					setDisplayedPokemons={setDisplayedPokemons} />
			</header>
			<section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
				<div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
					{displayedPokemons.length > 0 ? (
						displayedPokemons.map(({ url, name }, index) => (
							<PokeCard key={name} url={url} name={name} />
						))
					) : (
						<h2 className="font-medium text-lg text-black">
							포켓몬이 없습니다
						</h2>
					)}
				</div>
			</section>
			<div className="text-center">
				{allpokemons.length > displayedPokemons.length &&
					displayedPokemons.length !== 1 && (
						<button
							className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
							onClick={() =>
								setDisplayedPokemons(
									filterDisplayedPokemonData(
										allpokemons,
										displayedPokemons
									)
								)
							}
						>
							더보기
						</button>
					)}
			</div>
		</article>
	);
};

export default App;
