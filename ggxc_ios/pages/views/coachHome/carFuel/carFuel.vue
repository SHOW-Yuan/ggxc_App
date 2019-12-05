<template>
	<view>
	<view class="f-head">
		<view class="f-but">
			<button>添加</button>
		</view>
		<view class="f-rig">
			<view class="rig-box">
				<button @click="shangyue">上一月</button>
				<text>{{ynow}}-{{mnow}}</text>
				<button @click="xiayue" :class={box1:box1}>下一月</button>
			</view>
		</view>
	</view>
	<view v-for="(item, index) of listDatas" :key="index" class="f-refuel">
		<view class="refuel-det">
			<view class="refuel-top">
				<ul class="top-up">
					<li class="top-one">
						<p>{{item.cphm}}</p>
						<p>车牌号</p>
					</li>
					<li>
						<p><text>{{item.FuelingCapacity}}</text>/升</p>
						<p>用量</p>
					</li>
					<li>
						<p><text>{{item.OilPrice}}</text>/升</p>
						<p>价格</p>
					</li>
					<li>
						<p><text>{{item.OilMoney}}</text>/￥</p>
						<p>燃料金额</p>
					</li>
				</ul>
			</view>
			<view class="refuel-bottom">
				<view>{{item.Fueltype}}</view>
				<view>{{item.ReportingTime}}</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	export default {
		data() {
		    return {
		      newDate: "", //当前的日期的信息
		      ynow: "", //当前的年数
		      mnow: "", //当前的月份
		      date1: "", //当前的 2019-6
		      datas: [],
		      isVisible: false,
			  box1:true,
		      formData: {
		        datas: [
		          {
		            uid: '',
		            date: "",
		            schoolcode: '',
		            coach_id: '',
		          }
		        ]
		      },
		
		      listDatas: [],
		    }
		  },
		created() {
		
		    //日历
		    this.newDate = new Date();
		    this.ynow = this.newDate.getFullYear();
		    this.mnow1 = this.newDate.getMonth(); //月份
		    // console.log(this.mnow1);
		    this.mnow = ++this.mnow1; //先自增  后赋值
		    if (this.mnow < 10) {
		      this.mnow = "0" + `${this.mnow}`;
		    }
		    this.date1 = `${this.ynow}-${this.mnow}`;
		
		    this.datas = JSON.parse(uni.getStorageSync('datas'));
		    this.defaultValueData = this.formData.datas[0].date.split("-");
		    this.formData.datas[0].uid = this.datas[0].uid;
		    this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
		    this.formData.datas[0].coach_id = this.datas[0].id;
		  },
		  methods: {
		  
		      //上一月  下一月
		      shangyue() {
		        var date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
		        if (this.mnow > 1) {
		          // this.mnow =this.mnow;
		          if (this.mnow <= 10) {
		            this.mnow--;
		            this.mnow = "0" + `${this.mnow}`;
		            date2 = `${this.ynow}-${this.mnow}`;
		          } else if (this.mnow > 10) {
		            this.mnow--;
		            date2 = `${this.ynow}-${this.mnow}`;
		          }
		        } else if (this.mnow <= 1) {
		          if (this.mnow < 10) {
		            this.ynow--;
		            this.mnow = "0" + `${this.mnow}`;
		            this.mnow = 12;
		            date2 = `${this.ynow}-${this.mnow}`;
		          }
		        }
				this.box1=false;
		        this.formData.datas[0].date = date2;
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/CoachFuelReport",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
					var {data: {code, datas, msg}} = res;
					if(code!= 200){
						uni.showToast({
							title: msg,
							icon:'none'
						})
						this.listDatas=[];
						return;
					}
					  if (code === 200) {
						this.listDatas = datas;
					  }else {
						this.listDatas = [];
					  }
					}
				})
		      },
		      xiayue() {
		        var date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
		        if (date2 !== this.date1) {
		          if (this.mnow < 12) {
		            if (this.mnow < 9) {
		              this.mnow++;
		              this.mnow = "0" + `${this.mnow}`;
		              date2 = `${this.ynow}-${this.mnow}`;
		            } else {
		              this.mnow++;
		              date2 = `${this.ynow}-${this.mnow}`;
		            }
		          } else if (this.mnow >= 12) {
		            this.ynow++;
		            this.mnow = 1;
		            this.mnow = "0" + `${this.mnow}`;
		            date2 = `${this.ynow}-${this.mnow}`;
		          }
		          if (date2 == this.date1) {
					this.box1=true;
		          }
		        } else if (date2 == this.date1) {
					this.box1=true;
		        }
		        this.formData.datas[0].date = date2;
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/CoachFuelReport",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
					var {data: {code, datas, msg}} = res;
					if(code!= 200){
						uni.showToast({
							title: msg,
							icon:'none'
						})
						this.listDatas=[];
						return;
					}
					  if (code === 200) {
						this.listDatas = datas;
					  }else {
						this.listDatas = [];
					  }
					}
				})
		      },
		  
		      switchPicker(param) {
		        this[`${param}`] = !this[`${param}`];
		      },
		      async setChooseValue0(chooseData) {
		        this.formData.datas[0].date = `${chooseData[0]}-${chooseData[1]}`;
		        this.loadData();
		      },
		      service(){
		          this.$router.push('/reful');
		      },
		    }
		}	
</script>

<style>
	.f-head{
		width: 100%;
		height:100upx;
		border: 1px solid #f1f1f1;
		overflow: hidden;
	}
	.f-but{
		width:20%;
		height:100%;
		padding: 22upx;
		box-sizing: border-box;
		float: left;
		margin-right:6upx;
		margin-top: 6upx;
	}
	
	.f-but button{
		height:55upx;
		width:130upx;
		background: #04BD9D;
		text-align: center;
		line-height: 50upx;
		border-radius: 50upx;
		font-size:26upx;
		color: #fff;
	}
	.f-rig{
		width:75%;
		height: 72%;
		float: left;
		margin-top: 17upx;
		background: #ECECEC;
		box-sizing: border-box;
		padding:16upx;
	}
	.rig-box{
		width:100%;
		height:100%;
		text-align: center;
		line-height:32upx;
	}
	.rig-box button{
		height: 100%;
		width:130upx;
		background: #04BD9D;
		font-size:24upx;
		line-height:40upx;
		color: #fff;
		float: left;
	}
	.rig-box text{
		font-size:24upx;
		
	}
	.rig-box .box1{
		background: #bdbdbd;
	}
	.rig-box :nth-child(3){
		float: right;
	}
	.f-refuel{
		width:91%;
		margin: 0 auto;
		margin-top: 30upx;
	}
	.refuel-det{
		width:100%;
		border: 1px solid #eeeeee;
		border-radius:25upx;
		overflow: hidden;
	}
	.refuel-top{
		width:100%;
		height:160upx;
		background: #ffffff;
		box-sizing: border-box;
		padding:0 80upx;
	}
	.refuel-bottom{
		width:100%;
		height:70upx;
		background: #eeeeee;
	}
	.top-up{
		padding:0;
		margin:0;
		height: 95%;
		display: flex;
	}
	.top-up li{
		display: inline-block;
		padding:0;
		margin:0;
		list-style:none;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin:auto;
		font-size:30upx;
		margin-left:20upx;
	}
	.top-up .top-one :nth-child(1){
		color: #00BB99;
		font-size:34upx;
	}
	.top-up li text{
		color: #f87144;
	}
	.top-up li :nth-child(2){
		font-size:27upx;
	}
	.refuel-bottom{
		display: flex;
		justify-content: space-between;
		font-size:26upx;
		box-sizing: border-box;
		padding:0 20upx;
	}
	.refuel-bottom view{
		display: flex;
		align-items: center;
	}
</style>
