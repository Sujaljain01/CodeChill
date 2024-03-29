"use client"
import React, { useEffect, useState } from 'react';
import { Rubik } from 'next/font/google';
import {CircularProgress} from "@nextui-org/react";
import {Chip} from "@nextui-org/react";
import {Slider} from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';



import SideEffectsCards from '@/components/SideEffectsCards';
import Recomended from './Recomended';
import axios from 'axios';
import { SparklesPreview } from '@/components/Loader';
import toast from 'react-hot-toast';


interface AnalysisProps {
    product_title: string;
    product_desription: string;
    safety_score: number;
    ingredients_breakdown: {
        ingredient_name: string;
    }[];
    product_description: string;
    reviews_sentiment_analysis: {
        sentiment_score: number;
    }
}
const rubik = Rubik({
    subsets:["latin"]
});



const Analysis:React.FC = () => {
    
    const searchParams = useSearchParams()
    const link = searchParams.get("link")
    const filters = searchParams.get("filters")
    console.log(link, filters)
    const [response, setResponse] = useState<AnalysisProps | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.post("http://localhost:3000/api/analysis", {
              link: link,
              filters: filters,
            });
    
            setLoading(false);
            console.log(res.data);
            const dataString = res.data.replace(/```/g, '').replace(/json/g, '').replace(/JSON/g, ''); // Remove the ```json markers
            const data = JSON.parse(dataString);
            console.log("🚀 ~ fetchData ~ data:", data);
            setResponse(data);
    
            if (data?.safety_score !== 0) {
              // Do something when safety score is not 0
            } else {
              toast.error(
                "Contains one or more of the filters and hence the safety score is brought down to 0"
              );
            }
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        };
    
        fetchData();
      }, [link, filters]);

    console.log(response)

    return (<> {loading && <SparklesPreview />} {!loading && <>  
        <div className="flex h-screen background__container w-screen ">
            <div className="flex-row flex-1 w-full px-10 py-8 pragyam">
                {(response?.safety_score ?? 0 <= 50) && <h2  className='text-3xl font-semibold text-rose-700 bg-[#eec0c0] h-fit w-fit p-2 -rotate-12 mt-4'>Not a Wise Choice!</h2>}
                {(response?.safety_score && response.safety_score > 50 && response.safety_score < 80) && <h2  className='text-3xl font-semibold text-yellow-500 bg-[#e8efa58c] h-fit w-fit p-2 -rotate-12 mt-4'>Good Choice!</h2>}
                {(response?.safety_score ?? 0 >= 80) && <h2 className='text-3xl font-semibold text-green-500 bg-[#d2fbae] h-fit w-fit p-2 -rotate-12 mt-4'>Its a Great Choice!</h2>}
                <div className='flex mt-6 ml-8 w-full justify-evenly'>
                    <h1 className='text-4xl border-b-4 border-[#BA7969] mt-4 '>{response?.product_title}</h1>
                   
                    <CircularProgress
                       color="danger"
                        label="Safety Score"
                        size="lg"
                        
                        value={response?.safety_score}
                       
                        showValueLabel={true}
                        />
                </div>
                <p className='text-md mt-4 text-[0.8rm] analysis__container font-semibold'>{response?.product_description}</p>
                <div className='flex gap-6 pt-5'>
                    <div className="flex-1 flex-row mt-4  pt-4">
                        <h4>Ingredients</h4>
                        {response?.ingredients_breakdown && response.ingredients_breakdown.map((ing, index) => (
    <ul key={index} className='flex flex-wrap gap-2 analysis__container items-start pt-16 w-full'>
        <div className="flex flex-col shadow__input"></div>
        <li key={ing.ingredient_name}>
            <Chip color="danger" variant="shadow" className='my-2'>{ing.ingredient_name}</Chip>
        </li>
    </ul>
))}
                    </div>
                    <div className='flex-1 flex-row gap-4 pt-8'>
                        
                    <Slider 
                    isDisabled={true}
                    label="Sentimental  analysis" 
                    color="foreground"
                    showTooltip={true}
                    step={0.01} 
                
                    formatOptions={{style: "percent"}}
                    maxValue={1}
                    minValue={0}
                    marks={[
                        {
                        value: 0.2,
                        label: "20%",
                        },
                        {
                        value: 0.4,
                        label: "40%",
                        },
                        {
                        value: 0.6,
                        label: "40%",
                        },
                        {
                        value: 0.8,
                        label: "80%",
                        },
                    ]}
                    defaultValue={response?.reviews_sentiment_analysis?.sentiment_score}
                    className="max-w-md"
                    />
                    <p className='mt-10 analysis__container'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Cont</p>
                    </div>
                </div>
            </div>
            <div className="flex-row px-10 pt-4 flex-1 w-full divyesh">
                
            
          
                <div className='flex mt-6 ml-8 w-full justify-evenly'>
                    <h3 className='text-4xl border-b-4 border-[#BA7969] mb-4 pt-28 '>Harmful Ingridients</h3>
                   
              
            </div>
            <div className="shadow__input"></div>
            <SideEffectsCards />
            </div>

        </div>
        <Recomended />
      
       
        </> } </>
    );
};

export default Analysis;
