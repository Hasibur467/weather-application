const weatherStore={
    privateCity:'',
    privateCountry:'',
    API_KEY:'6cb59e3b4a059777497ddd2324c554f3',
    set city(name){
    //validadte
    console.log('city name')
    this.privateCity = name

    },
    set country(name){
        console.log('country name')   
     this.privateCountry = name
 
    },

   async fetchData(){
     const res=await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&units=metric&appid=${this.API_KEY}`)
     return await res.json()
     },
}
const storage={
    privateCity:'',
    privateCountry:'',
    set city(name){
        this.privateCity = name
    },
    set country(name){
        this.privateCountry = name
    },
    saveItem(){
     localStorage.setItem('BD-weather-city',this.privateCity)
     localStorage.setItem('BD-weather-country',this.privateCountry)
    },

}

const UI={
    city:'',
    country:'',
    loadSeletores(){
    const cityElm = document.querySelector('#city')
    const cityInfoElm = document.querySelector('#w-city')
    const iconElm = document.querySelector('#w-icon')
    const temperatureElm = document.querySelector('#w-temp')
    const pressureElm = document.querySelector('#w-pressure')
    const humidityElm = document.querySelector('#w-humidity')
    const feelElm = document.querySelector('#w-feel')
    const formElm = document.querySelector('#form')
    const countryElm= document.querySelector('#country')
    const msgElm = document.querySelector('#messageWrapper')
    
    return {
         cityElm,
         cityInfoElm,
         iconElm,
         temperatureElm,
         pressureElm,
         humidityElm,
         feelElm,
         formElm,
         countryElm,
         msgElm,
        }
     },
     getInputValues(){
         const {cityElm,countryElm} = this.loadSeletores()
         const city = cityElm.value 
         const country = countryElm.value
         return {
             city,
             country
         }
       },
       validateInput(city,country){
           let error = false
         if(city ===''|| country ===''){
             error=true
          } 
          return error

       },
       hideMessage(){
           const msgContentElm=document.querySelector('.err-msg')
           if(msgContentElm){
               setTimeout(()=>{
                msgContentElm.remove()
               },2000)
           }
         },
       showMessage(msg){
           const {msgElm}= this.loadSeletores()
           const elm=`<div class='alert alert-danger err-msg'>${msg}</div>`
           if(!msgContentElm){
            msgElm.insertAdjacentHTML('afterbegin',elm)
           }
           this.hideMessage()
       },
       getIconSrc(iconCode){
           return 'https://openweathermap.org/img/w/' + iconCode + '.png'
       },
       printWeather(data){
           const {
               cityInfoElm,
               temperatureElm,
               pressureElm,
               feelElm,
               humidityElm,
               iconElm,
           } = this.loadSeletores()
           const {main,weather,name}= data
           console.log(data)
           cityInfoElm.textContent= name
           temperatureElm.textContent=`Temperature:${main.temp}°C`
           humidityElm.textContent=`Humidity:${main.humidity}kpa`
           pressureElm.textContent=`Pressure:${main.pressure}kpa`
           feelElm.textContent=weather[0].description
           const src=this.getIconSrc(weather[0].icon)
           iconElm.setAttribute('src',src)
           },
     resetInput(){
       const {cityElm,countryElm} = this.loadSeletores()
       cityElm.value = ''
       countryElm.value = ''
     },
     init(){
       const {formElm}= this.loadSeletores()
       formElm.addEventListener('submit',async(e)=>{
           e.preventDefault()
           //get the input values
         const {city,country} = this.getInputValues()
         //restInput
         this.resetInput()
         //validet input values
         const error=this.validateInput(city,country)
         //show msg to UI
         if(error)return  this.showMessage('Please provide invalid input')
         this.city=city
         this.country=country
         //setting data to weatherStore
         weatherStore.city=city
         weatherStore.country=city
         //setting data to localStorage
         storage.city = city
         storage.country = country
         storage.saveItem()

         //send  request to API server
         const data=await weatherStore.fetchData()
         this.printWeather(data)
   }) 
      document.addEventListener('DOMContentLoaded',async (e) =>{
          //load data from local storage
          // setting data to data store
          if(localStorage.getItem('BD-weather-city')){
            weatherStore.city=localStorage.getItem('BD-weather-city')
          }
            if(localStorage.getItem('BD-weather-country')){
            weatherStore.country=localStorage.getItem('BD-weather-country')
          }
          // send request to API server
          const data=await weatherStore.fetchData()
          //show data to UI
          this.printWeather(data)
      })
     }
   }

   UI.init()
   
