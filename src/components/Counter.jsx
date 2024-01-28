import { Component } from 'react';

class Counter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			days: parseInt(localStorage.getItem('daysWithoutSmoking') || 0, 10),
			lastIncrement: localStorage.getItem('lastIncrement'),
			failed: false,
			quote: ""
		};
	}

	componentDidMount() {
		this.fetchQuote();
		this.checkLastIncrement();
	}

	fetchQuote = async () => {
		const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
		const apiUrl = 'https://zenquotes.io/api/random';

		try {
			const response = await fetch(proxyUrl + apiUrl);
			const data = await response.json();
			this.setState({ quote: data[0].q + " - " + data[0].a });
		} catch (error) {
			console.error("Error fetching quote:", error);
			this.setState({ quote: "Stay strong, every day is a new opportunity!" }); // Fallback quote
		}
	};


	checkLastIncrement = () => {
		const today = new Date().toDateString();
		if (this.state.lastIncrement !== today) {
			this.setState({ canIncrement: true });
		}
	};

	incrementDays = () => {
		const today = new Date().toDateString();
		if (this.state.lastIncrement !== today) {
			const newCount = this.state.days + 1;
			this.setState({ days: newCount, lastIncrement: today });
			localStorage.setItem('daysWithoutSmoking', newCount.toString());
			localStorage.setItem('lastIncrement', today);
		}
	};

	failChallenge = () => {
		this.setState({ failed: true });
	};

	resetChallenge = () => {
		localStorage.setItem('daysWithoutSmoking', '0');
		localStorage.setItem('lastIncrement', '');
		this.setState({ days: 0, lastIncrement: '', failed: false });
	};

	render() {
		const { days, failed, quote } = this.state;
		const bgColor = failed ? "bg-red-500" : "bg-gray-100";
		const textColor = failed ? "text-white" : "text-gray-700";

		return (
			<div className={`flex flex-col items-center justify-center h-screen ${bgColor} p-4`}>
				<h1 className={`text-4xl font-bold ${textColor} mb-8`}>
					Days Without Smoking
				</h1>
				<div className={`text-6xl font-semibold mb-6 ${failed ? "text-red-800" : "text-blue-500"}`}>
					{days}
				</div>
				{!failed && (
					<div className="text-md text-center mb-4 font-medium text-gray-600">
						{quote || "Loading quote..."}
					</div>
				)}
				<div className="flex space-x-4">
					<button onClick={this.incrementDays} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
						Increase
					</button>
					<button onClick={this.failChallenge} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
						Fail
					</button>
					<button onClick={this.resetChallenge} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
						Reset
					</button>
				</div>
			</div>
		);
	}
}

export default Counter;
