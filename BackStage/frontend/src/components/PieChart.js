import React from 'react';
import 'chart.js/auto'; 
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import axios from "../api/axios";

// const labels = ["January", "February", "March", "April", "May", "June"];

// const data = {
//     labels:labels,
//     datasets:[
//         {
//             label:"My Fist dataset",
//             backgroundColor:["rgb(255, 99, 132)","rgb(0, 99, 132)"],
//             borderColor:"rgb(255, 99, 132)",
//             data:[0, 10, 5, 2, 20, 30, 45]
//         }
//     ]
// }

function PieChart() {
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

    const randomRGBColors = [];
    for (let i = 0; i < 30; i++) {
        const randomR = Math.floor(Math.random() * 256); // 生成 0 到 255 之間的隨機數作為紅色分量
        const randomG = Math.floor(Math.random() * 256); // 生成 0 到 255 之間的隨機數作為綠色分量
        const randomB = Math.floor(Math.random() * 256); // 生成 0 到 255 之間的隨機數作為藍色分量

        // 將 RGB 顏色格式化為字符串，並添加到陣列中
        const color = `rgb(${randomR}, ${randomG}, ${randomB})`;
        randomRGBColors.push(color);
    }
    
    const labels = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"
    ];
    
    const data = {
        labels:labels,
        datasets:[
            {
                label:"訂單量",
                backgroundColor:randomRGBColors,
                borderColor:"rgb(0, 0, 0,0)",
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
        <div className='bg-white border border-dark rounded-3 shadow pb-4'>
            <Pie data={data} options={options}></Pie>
        </div>
    )
}

export default PieChart