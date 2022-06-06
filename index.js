import  express from 'express'
import {buyToTarget} from './MM_Test.js'
import  bodyParser from "body-parser"
import  cors from 'cors'
const app = express()
const router = express.Router();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3001
// respond with "hello world" when a GET request is made to the homepage
router.get('/', (req, res) => {
    return res.send("hihi")
})  

router.post("/swap" , async (req, res ) => {
    console.log("req.body.targetPrice",req.body)
    const data = await buyToTarget(req.body.targetPrice)
    return res.json(data)
})
app.use("/", router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

