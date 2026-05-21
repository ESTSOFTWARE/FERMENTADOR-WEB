import { ReactLenis } from "lenis/react";
import Blog from "../components/Blog";
import BusinessModel from "../components/BusinessModel";
import Characteristics from "../components/Characteristics";
import Equipment from "../components/Equipment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Justification from "../components/Justification";
import Objectives from "../components/Objectives";
import ProblemStatement from "../components/ProblemStatement";
import Scope from "../components/Scope";

const LandingView = () => {
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            <Header/>
            <Hero/>
            <div id="planteamiento"><ProblemStatement/></div>
            <div id="justificacion"><Justification/></div>
            <div id="objetivos"><Objectives/></div>
            <div id="alcances"><Scope/></div>
            <div id="negocio"><BusinessModel/></div>
            <div id="features"><Characteristics/></div>
            <div id="how-it-works"><HowItWorks/></div>
            <div id="blog"><Blog/></div>
            <div id="equipo"><Equipment/></div>
            <Footer/>
        </ReactLenis>
    );
}

export default LandingView;
