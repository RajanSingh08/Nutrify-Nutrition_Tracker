const otpValidation = async(otpTime)=>{
    try {
        const currTime = new Date();
        const timediff = currTime.getTime() - otpTime;
        const diff = (timediff/(1000*60));
        if(diff>5){
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {otpValidation}