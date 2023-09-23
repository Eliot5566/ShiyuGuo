import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>未經授權</h1>
            <br />
            <p>你沒有訪問當前頁面的授權</p>
            <div className="flexGrow">
                <button onClick={goBack}>上一頁</button>
            </div>
        </section>
    )
}

export default Unauthorized
