import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './screens/Home';
import Navbar from './components/Navbar';
import QRCode from './screens/QRCode';
import Register from './screens/authentication/Register';
import Login from './screens/authentication/Login';
import Footer from './components/Footer';

function App() {
	return (
		<div>
			<Router>
				<Navbar />
				<Route exact path="/">
					<Home />
				</Route>
				<Route path="/Home">
					<Home />
				</Route>
				<Route path="/QRCode">
					<QRCode />
				</Route>
				<Route path="/Login">
					<Login />
				</Route>
				<Route path="/Register">
					<Register />
				</Route>
			</Router>
			<Footer />
		</div>
	);
}

export default App;
