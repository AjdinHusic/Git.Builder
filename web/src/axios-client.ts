import axios from "axios";

const client = axios.create({
    baseURL: "https://localhost:7187", 
    
    headers: {
        "Content-Type": 'application/json'
    }}
);

export default client;