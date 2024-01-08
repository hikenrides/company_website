import '../App.scss';
import {IoMailOutline, IoChevronForwardCircle, IoStar} from 'react-icons/io5';
import {IconContext} from "react-icons";
import Card from '../Card.jsx';
import {motion} from 'framer-motion';
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";





let easeing = [0.6,-0.05,0.01,0.99];

const handleTabClick = (tabName) => {
  setActiveTab(tabName);
};

const stagger = {
  animate:{
    transition:{
      delayChildren:0.4,
      staggerChildren:0.2,
      staggerDirection:1
    }
  }
}

const fadeInUp = {
  initial:{
    y:-60,
    opacity:0,
    transition:{
      duration:0.6, ease:easeing
    }
  },
  animate:{
    y:0,
    opacity:1,
    transition:{
      duration:0.6,
      delay:0.5,
      ease:easeing
    }
  }
};

const transition = {duration:1.4,ease:[0.6,0.01,-0.05,0.9]};

const firstName = {
  initial:{
    y:-20,
  },
  animate:{
    y:0,
    transition:{
      delayChildren:0.4,
      staggerChildren:0.04,
      staggerDirection:-1
    }
  }
}

const lastName = {
  initial:{
    y:-20,
  },
  animate:{
    y:0,
    transition:{
      delayChildren:0.4,
      staggerChildren:0.04,
      staggerDirection:1
    }
  }
}

const letter = {
  initial:{
    y:400,
  },
  animate:{
    y:0,
    transition:{duration:1, ...transition}
  }
};

const btnGroup={
  initial:{
    y:-60,
    opacity:0,
    transition:{duration:0.6, ease:easeing}
  },
  animate:{
    y:0,
    opacity:1,
    animation:{
      duration:0.6,
      ease:easeing
    }
  }
};
const star={
  initial:{
    y:60,
    opacity:0,
    transition:{duration:0.8, ease:easeing}
  },
  animate:{
    y:0,
    opacity:1,
    animation:{
      duration:0.6,
      ease:easeing
    }
  }
};

const header={
  initial:{
    y:-60,
    opacity:0,
    transition:{duration:0.05, ease:easeing}
  },
  animate:{
    y:0,
    opacity:1,
    animation:{
      duration:0.6,
      ease:easeing
    }
  }
};




function IndexPage() {

  const { user } = useContext(UserContext);
  return (
    <motion.div initial='initial' animate='animate'>
      

      <motion.div className="content_wrapper" initial={{opacity:0,scale:0}} animate={{opacity:1, scale:1}} transition={{duration:0.3, ease:easeing}}>
        <div className="left_content_wrapper">

          <motion.h2>

            <motion.span variants={firstName} initial="initial" animate="animate" className='first'>
                <motion.span variants={letter}>Y</motion.span>
                <motion.span variants={letter}>o</motion.span>
                <motion.span variants={letter}>u</motion.span>
                <motion.span variants={letter}>r</motion.span>
                <motion.span variants={letter} className="second">r</motion.span>
                <motion.span variants={letter}>i</motion.span>
                <motion.span variants={letter}>d</motion.span>
                <motion.span variants={letter}>e,</motion.span>
            </motion.span>
            <motion.span variants={lastName} initial="initial" animate="animate" className='last'>
                <motion.span variants={letter}>Y</motion.span>
                <motion.span variants={letter}>o</motion.span>
                <motion.span variants={letter}>u</motion.span>
                <motion.span variants={letter}>r</motion.span>
                <motion.span variants={letter} className="second">w</motion.span>
                <motion.span variants={letter}>a</motion.span>
                <motion.span variants={letter}>y,</motion.span>
                <motion.span variants={letter} className="second">O</motion.span>
                <motion.span variants={letter}>u</motion.span>
                <motion.span variants={letter}>r</motion.span>
                <motion.span variants={letter} className="second">c</motion.span>
                <motion.span variants={letter}>o</motion.span>
                <motion.span variants={letter}>n</motion.span>
                <motion.span variants={letter}>n</motion.span>
                <motion.span variants={letter}>e</motion.span>
                <motion.span variants={letter}>c</motion.span>
                <motion.span variants={letter}>t</motion.span>
                <motion.span variants={letter}>i</motion.span>
                <motion.span variants={letter}>o</motion.span>
                <motion.span variants={letter}>n</motion.span>
  
  
            </motion.span>
          </motion.h2>

          <motion.p variants={fadeInUp}>Our innovative ride-sharing platform fosters seamless connections between drivers and passengers, 
          enabling cost-effective and collaborative journeys.</motion.p>

          <motion.div className="btn_group" variants={stagger}>
            <motion.div className="btn btn_primary" variants={btnGroup} whileHover={{scale:1.05}} whileTap={{scale:0.95}}>
            <Link to={'/account/trips'} >
        <div
          className={'flex text-white cursor-pointer'}
          onClick={() => handleTabClick("tripOffers")}
        >
          Available trips
        </div>
        </Link>
              <IconContext.Provider value={{color:"#14da8f", size:"25px"}}>
                <IoChevronForwardCircle/>
              </IconContext.Provider>
            </motion.div>
            <motion.div className="btn btn_secondary" variants={btnGroup} whileHover={{scale:1.05}} whileTap={{scale:0.95}}>
            <Link to={user ? '/account' : '/login'}>
        <div className=''>
          LOGIN/REGISTER
        </div>
      </Link>
            </motion.div>
          </motion.div>

          <motion.div className="right_content_wrapper2">          
          <motion.img src={'/images/hikenrides.png'} alt="bg" initial={{x:200, opacity:0}} animate={{x:0, opacity:1}} transition={{duration:.5, delay:0.8}}/>
        </motion.div>
          <motion.div className="review_container" variants={stagger}>
            <motion.p className="total_review" variants={star}>Reviews</motion.p>
            <IconContext.Provider value={{color:"#fff", size:"18px"}}>
                <motion.span variants={star} whileHover={{scale:1.2, rotate:180,borderRadius:'100%',cursor:'pointer'}}><IoStar/></motion.span>
                <motion.span variants={star} whileHover={{scale:1.2, rotate:180,borderRadius:'100%',cursor:'pointer'}}><IoStar/></motion.span>
                <motion.span variants={star} whileHover={{scale:1.2, rotate:180,borderRadius:'100%',cursor:'pointer'}}><IoStar/></motion.span>
                <motion.span variants={star} whileHover={{scale:1.2, rotate:180,borderRadius:'100%',cursor:'pointer'}}><IoStar/></motion.span>
                <motion.span variants={star} whileHover={{scale:1.2, rotate:180,borderRadius:'100%',cursor:'pointer'}}><IoStar/></motion.span>
            </IconContext.Provider>
            <motion.p className="more_review" variants={star}>Travel Smart</motion.p>
          </motion.div>
          
        </div>
        <motion.div className="right_content_wrapper">          
          <motion.img src={'/images/hikenrides.png'} alt="bg" initial={{x:200, opacity:0}} animate={{x:0, opacity:1}} transition={{duration:.5, delay:0.8}}/>
        </motion.div>
      </motion.div>

      <Card/>


    </motion.div>
  );
}

export default IndexPage;