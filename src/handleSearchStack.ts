import { arrBackTagsSearch } from "./dataArrays/listsStackDevops"
import { useState } from "react"
import { arrFrontTagsSearch } from "./dataArrays/listsStackDevops";
import { arrFullTagsSearch } from "./dataArrays/listsStackDevops";

export const handleSearchStack = (valueInp: string) => {
    const [displaySearchItems, setDisplaySearchItems] = useState<string[]>([]);
    arrBackTagsSearch.map(el => {
        if(el === valueInp){
            setDisplaySearchItems(prev => [...prev, 'Backend Development'])
            return true;
        } 
    })    
    arrFrontTagsSearch.map(el => {
        if(el === valueInp){
            setDisplaySearchItems(prev => [...prev, 'Frontend Development'])
            return true;
        } 
    })  
    arrFullTagsSearch.map(el => {
        if(el === valueInp){
            setDisplaySearchItems(prev => [...prev, 'Full-stack Development'])
            return true;
        } 
    })      
}