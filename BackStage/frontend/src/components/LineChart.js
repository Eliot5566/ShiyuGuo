import React from 'react';
import 'chart.js/auto'; 
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import axios from "../api/axios";


// const labels = ["9/1-9/7", "9/8-9/14", "9/15-9/21", "9/22-9/28", "9/29-9/30"];


function LineChart() {
    const [orders, setOrders] = useState([]);

    // 在第一次渲染時抓資料
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("/order", // eslint-disable-line no-unused-vars
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                // console.log(response.data);
                setOrders(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const createdDates = orders.map((order) => order.created_at);
    const groupedDates = {};
    createdDates.forEach((dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份是從 0 開始的，所以要加 1
        const day = date.getDate();
        
        // 以日期的格式（YYYY-MM-DD）作為鍵來分組日期
        const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        
        if (!groupedDates[formattedDate]) {
            groupedDates[formattedDate] = 0; // 初始化為0
        }
        
        groupedDates[formattedDate]++;
    });
    const startDate = new Date('2023-09-01'); // 開始日期
    const endDate = new Date('2023-09-30');   // 結束日期
    const oneDay = 24 * 60 * 60 * 1000;       // 一天的毫秒數
    const resultArray = [];

    for (let date = startDate; date <= endDate; date.setTime(date.getTime() + oneDay)) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        
        resultArray.push(groupedDates[formattedDate] || 0); // 如果沒有資料，則設為0
    }
    // console.log(resultArray);
    const labels = [
        "9/1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"
    ];
    
    const data = {
        labels:labels,
        datasets:[
            {
                label:"訂單量",
                backgroundColor:"rgb(0, 99, 132)",
                borderColor:"rgb(0, 99, 132)",
                data:resultArray
            }
        ],
    }
    const options = {
        animation: {
            duration:1500
        }
    }

    return (
        <div className='bg-white border border-secondary rounded-3 shadow p-2'>
            <Line data={data} options={options}></Line>
        </div>
    )
}

export default LineChart


