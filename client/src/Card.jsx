import React from 'react';
import {IoNewspaper} from "react-icons/io5";
import {IconContext} from "react-icons";
import {motion} from 'framer-motion';

let easing = [0.6,-0.05,0.01,0.99];

const container = {
    show:{
        transition:{
            staggerChildren:0.2
        }
    }
};

const item = {
    hidden:{opacity:0,y:20},
    show:{
        opacity:1,
        y:0,
        transition:{
            ease:'easeInOut',
            duration:.2
        }
    }
}

const title = {
    hidden:{
        y:60,
        opacity:0
    },
    show:{
        y:0,
        opacity:1,
        transition:{
            delay:.2,
            duration:0.6,
            ease:easing
        }
    }
};

const hoverEffect = {
    whileHover:{
        scale:1.5,rotate:630,borderRadius:"100%"
    },
    whileTap:{
        scale:.8,rotate:630,borderRadius:"100%"
    },
}

function Card() {
  return (
    <motion.div className="service_container">
        <div className="title_wrapper">
            <motion.span className="service_title"
                initial={{y:20, opacity:0}}
                animate={{y:0, opacity:1}}
                exit={{opacity:0}}
                transition={{duration:.5, delay:1.8}}
            >Process to getting a ride</motion.span>
        </div>


        <motion.div className="service_card" variants={container} initial="hidden" exit="exit" whileInView="show" viewport={{once:false}}>

            
            <motion.div className="card" variants={item}>
                <motion.span className="service_icon" style={{backgroundColor:"#D2691E"}} variants={hoverEffect}>
                <IconContext.Provider value={{color:"#56a8f4", size:"22px"}}>
                        1
                    </IconContext.Provider>
                </motion.span>
                <h3>Browse, select Available trips/rides and find a suitable one for you. NB: Make sure your account is verified</h3>
                {/*<a href="#">
                    <span>Available trips →</span>
                </a>*/}
            </motion.div>
            <motion.div className="card" variants={item}>
                <motion.span className="service_icon" style={{backgroundColor:"#D2691E"}} variants={hoverEffect}>
                <IconContext.Provider value={{color:"#56a8f4", size:"22px"}}>
                        2
                    </IconContext.Provider>
                </motion.span>
                <h3>Insert the details required and book your trip.<br/>NB: Make sure there's suffient funds on your hikenrides account</h3>
            </motion.div>
            <motion.div className="card" variants={item}>
                <motion.span className="service_icon" style={{backgroundColor:"#D2691E"}} variants={hoverEffect}>
                <IconContext.Provider value={{color:"#56a8f4", size:"22px"}}>
                        3
                    </IconContext.Provider>
                </motion.span>
                <h3>Trip details of the driver will be sent to you<br/>and you will also receive a reference number</h3>
            </motion.div>
            <motion.div className="card" variants={item}>
                <motion.span className="service_icon" style={{backgroundColor:"#D2691E"}} variants={hoverEffect}>
                <IconContext.Provider value={{color:"#56a8f4", size:"22px"}}>
                        4
                    </IconContext.Provider>
                </motion.span>
                <h3>The driver will receive payment after getting the reference number <br/>from you at the pickup location</h3>
            </motion.div>
        </motion.div>
        <div className="image_container">
            <motion.img src={'/images/paystack.jpg'} alt="bg" initial={{x:200, opacity:0}} animate={{x:0, opacity:1}} transition={{duration:.5, delay:0.8}} style={{ margin: 'auto', display: 'block' }} />
        </div>
    </motion.div>
  )
}

export default Card;
