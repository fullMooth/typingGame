let box = document.querySelector(".screen")
let keys = document.querySelector(".keyArea .box1")
let scoreEle = document.querySelector(".Point")
let HealthEle = document.querySelector(".Health")
let tip = document.querySelector(".tip")
let tip_score = document.querySelector(".score")
let tip_btn = document.querySelector(".btn")
let flagEle = document.querySelector(".flag")
let audio = document.querySelector(".audio")
let audioBtn = document.querySelector(".audioBtn")



class Game{
    constructor(){   //构造函数  实例化对象时立马调用
        this.letterDate = {}    // json  对象   键值对形式   Key:Value
        //   {
        //      A:{top:'1',left:'',node:Node},
        //      B:{top:'1',left:'',node,Node}
        //     }
        this.num = 3
        this.screen = ""
        this.keys = ""
        this.scoreEle = ""   //积分的标签
        this.score = 0      // 积分
        this.guanQiaNum = 3   // 每增加十分 加快速度
        this.sudu = 0.1
        this.HealthEle = ""
        this.HelethNum = 10  // 生命值
        this.tip = ""   //弹框
        this.tip_score=""  // 弹框中的分数
        this.tip_btn = ""  // 弹框中的按钮
        this.flag = false  //默认暂停
        this.flagEle = ""
        this.num1 = 0
        this.flag1 = false
        this.audioBtn = ""
        this.flag2 = false  // audio暂停
        this.audio = ""  // audio元素
    }
    // 创建字母
    createLetter(num=this.num){   // 函数的默认参数用法
        for(let i=0;i<num;i++){
            let letterEle = document.createElement("div")   // 通过js创建div
            letterEle.className = "letter"
            // 随机生成【a-z】
            // 重要步骤：字母重复   字母重叠
            //解决字母重复问题
            let letter
            do{
                let code = Math.floor(Math.random()*26)+65   // A-Z ASCII值
                letter = String.fromCharCode(code)          //具体字母
            }while(this.letterDate[letter])  //判断是否存在，若存在则重新生成

            letterEle.style.backgroundImage = `url('img/A_Z/${letter}.png')`
            letterEle.style.top = "1rem"

            let left
            do{
                left = Math.random()*6.97
            }while(this.isOk(left))

            letterEle.style.left = left +"rem"
            this.screen.appendChild(letterEle)
            this.letterDate[letter] =  {top:1,left:left,'node':letterEle}
        }
    }
    // 下落
    run(){
        this.t = setInterval(()=>{
            // 0.1秒钟遍历一次我们的元素，给他增加top值
            for(let key in this.letterDate){
                this.letterDate[key]['top']+=this.sudu
                this.letterDate[key]['node'].style.top=this.letterDate[key]['top']+"rem"
                if(this.letterDate[key]['top']>7.94){
                    //消失 并  创建新的字母
                    // 消失 从screen 移除 div元素     从 this.letterDate中删除元素
                    // 创建字母 this.createLetter(1)
                    this.removeAdd(key)
                    //减生命值
                    this.HelethNum--
                    this.HealthEle.innerText = this.HelethNum
                    if(this.HelethNum<=0){
                        this.tip.style.display="block"
                        this.tip_score.innerText = this.score
                        this.pause()
                    }
                }
            }
        },100)
    }
    // 打字
    addEvent(){
        //
        this.keys.addEventListener("touchstart",(e)=>{
            if(e.target.className!="box1"  && this.flag1){
                let letter = e.target.innerText
                // 检测是否点击正确
                if(this.letterDate[letter]){
                    // 检测成功
                    // 积分增加   到达10分 速度增快  
                    this.score ++
                    this.guanQiaNum--
                    console.log(this.guanQiaNum)
                    if(this.guanQiaNum<=0){
                        console.log(123)
                        this.guanQiaNum = 3
                        this.sudu+=0.1
                    }
                    this.scoreEle.innerText = this.score
                    this.removeAdd(letter)
                }
            }
        })
        this.tip_btn.addEventListener("touchstart",(e)=>{
            this.tip.style.display = "none"
            this.replay()
        })
        this.flagEle.addEventListener("touchstart",()=>{
            if(this.flag == false) {
                this.flag = true
                this.flagEle.className = "flag start"
                this.flag1 = true
                if(this.num1==0){
                    this.createLetter()
                    this.num1=1
                }
                this.run()

            }else{
                this.flag = false
                this.flagEle.className = "flag pause"
                this.pause()
                this.flag1 = false
            }
        })
        this.audioBtn.addEventListener("touchstart",()=>{
            if(this.flag2==false){
                this.flag2 = true
                this.audioBtn.className = "audioBtn Aplay"
                this.audio.play()
            }else{
                this.flag2 = false
                this.audioBtn.className = "audioBtn Apause"
                this.audio.pause()
            }
        })
    }
    // 暂停
    pause(){
        clearInterval(this.t)
    }
    // 重新开始
    replay(){
        // 初始化
        this.sudu = 0.1   // 速度初始化
        this.score = 0   // 积分初始化
        this.scoreEle.innerText = this.score  // 网页显示成绩初始化
        this.HealthNum = 10   // 生命值初始化
        this.HealthEle.innerText = this.HealthNum  //  网页中显示生命值初始化
        this.letterDate = {}    // 字母数据情况
        this.screen.innerHTML = ""  //  屏幕中数据清空

        // 开始生成
        this.createLetter(this.num)
        this.run()
    }
    // 解决重叠问题  是否重叠 重叠 返回true  不重叠返回false
    isOk(left){
        for(let key in this.letterDate){
            let flag = Math.abs(left-this.letterDate[key]['left'])<0.53
            if(flag){
                return true
            }
        }
        return false
    }
    removeAdd(key){
        // 移除并且添加新元素  key 字母
        this.screen.removeChild(this.letterDate[key]['node'])
        delete this.letterDate[key]
        this.createLetter(1)
    }
    start(){

    }
}

let obj = new Game()
obj.num=5  //默认数值
obj.screen = box
obj.keys = keys
obj.scoreEle = scoreEle
obj.HealthEle = HealthEle
obj.tip = tip
obj.tip_score = tip_score
obj.tip_btn = tip_btn
obj.flagEle = flagEle
obj.audioBtn = audioBtn
obj.audio = audio

obj.addEvent()


