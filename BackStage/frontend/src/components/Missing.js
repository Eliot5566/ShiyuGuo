import { Link } from "react-router-dom"
import Transition from '../components/Transition';

const Missing = () => {
    return (
        <Transition>
            <article className="container text-center">
                <h1>錯誤！</h1>
                <p>找不到頁面</p>
                <div className="flexGrow">
                    <Link to="/">儀錶板</Link> <br/>
                </div>
            </article>
        </Transition>
    )
}

export default Missing
