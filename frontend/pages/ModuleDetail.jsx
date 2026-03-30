import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import QuizCard from "../components/QuizCard";
import api from "../services/api";

export default function ModuleDetail() {
    const {id} = useParams();
    const moduleld = Number(id);
    const[module , setModule] = useState(null);
    const[loading , setLoading] = useState(true);
    const[currentSlide,setCurrentSlide] = useState(0);
}