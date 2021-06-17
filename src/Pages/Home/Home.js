import React, { useContext, useState, useEffect } from 'react'
import { modeContext } from '../../components/contexts/ModeContext'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineCaretDown } from 'react-icons/ai'
import {HomeContainer, HomeForm, SearchBox, SelectBox, SearchIcon} from './HomeStyles.js'
import HomeCards from '../../components/HomeCards/HomeCards'
import { CountriesContext } from '../../components/contexts/CountriesComtext/CountriesContext'
import axios from 'axios'
import { 
    FETCH_REQUEST, 
    FETCH_SUCCESS, 
    FETCH_FILTERED,  
    FETCH_ERROR_All, 
    FETCH_ERROR_Details, 
    FETCH_SEARCH, 
    FETCH_DETAILS } from '../../components/contexts/CountriesComtext/Types'


const Home = () => {
    const {isLight} = useContext(modeContext)
    const {fetchedCountries, dispatch} = useContext(CountriesContext)
    
    const [felterrRegion, setFelterrRegion] = useState("")
    const [searched, setSearched] = useState("")
    const [showOptions, setShowOptions] = useState(false)
    const toggleShowOptions = ()=>{
        setShowOptions(!showOptions)
    }

    const fetchData = ()=>{
        dispatch({type: FETCH_REQUEST})
        axios.get(`https://restcountries.eu/rest/v2/all`)
        .then(res=>{
            dispatch({type: FETCH_SUCCESS, payload: res.data})
            console.log(res.data);
        })
        .catch(err=>{
            dispatch({type: FETCH_ERROR_All, payload: err.message})
        })
    }

    const fetchStoredData = ()=>{
        dispatch({type: FETCH_SUCCESS, payload: fetchedCountries})
    }

    const options = ["africa", "Americas", "asia", "europe", "oceania"]

    const felterByRegion = (region)=>{
        dispatch({type: FETCH_REQUEST})
        axios.get(`https://restcountries.eu/rest/v2/region/${region}`)
        .then(res=>{
            dispatch({type: FETCH_FILTERED, payload: res.data})
        })
        .catch(err=>{
            dispatch({type: FETCH_ERROR_All, payload: err.message})
        })
    }

    const searchCountry = (name)=>{
        dispatch({type: FETCH_REQUEST})
        axios.get(`https://restcountries.eu/rest/v2/name/${name}`)
        .then(res=>{
            dispatch({type: FETCH_SEARCH, payload: res.data})
        })
        .catch(err=>{
            dispatch({type: FETCH_ERROR_All, payload: err.message})
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        searchCountry(searched)
        setSearched("")
    }

    useEffect(() => {
        if(fetchedCountries.length == 0){
            fetchData()
        } 
        else{
            fetchStoredData()
        }
    }, [])

    return (
        <HomeContainer isLight={isLight}>
            <HomeForm isLight={isLight} onSubmit={(e)=>handleSubmit(e)}>
                <SearchBox isLight={isLight}>
                    <span onClick={(e)=>handleSubmit(e)}>
                        <SearchIcon />
                    </span>
                    <input 
                        type="text"
                        value={searched} 
                        placeholder="Serach for A Country" 
                        onChange={e=> setSearched(e.target.value)} 
                    />
                </SearchBox> 
                
                <SelectBox isLight={isLight} showOptions={showOptions}>
                    <div className="select-header" onClick={toggleShowOptions}>
                        <span>filter by region <span className="selected-region">{felterrRegion}</span></span>
                        <AiOutlineCaretDown />
                    </div>
                    <div className="options">
                        {
                            options.map((item, index)=>
                                <p 
                                    className="option" 
                                    key={index}
                                    onClick={()=>{
                                        felterByRegion(item);
                                        toggleShowOptions()
                                        setFelterrRegion(item)
                                        }
                                    }
                                >
                                    {item}
                                </p>
                            )

                        }
                    </div>
                </SelectBox>
            </HomeForm>

            <HomeCards />
        </HomeContainer>
    )
}

export default Home
