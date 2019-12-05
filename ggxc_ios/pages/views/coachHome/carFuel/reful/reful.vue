<template>
	<view class="box">
		<view class="form-box">
			<view class="carHao">
				<text>车牌号：</text>
				<input type="text" v-model.trim="con" placeholder="请输入车牌号"/>
				<view class="sos-box" ref='singleDom' v-show="flag">
					<ul class="soso">
					  <block v-for="(item, index) in items" :key="index">
						  <li @click="gotoItem(item)">
							  {{item.cphm}}
						  </li>
					  </block>
					</ul>
				</view>
			</view>
			<view>
				<text>教练名称：</text>
				<input type="text" v-model.lazy="formData.datas[0].coach" placeholder="请输入教练名称"/>
			</view>
			<view>
				<text>选择加燃时间：</text>
				<view style="width: 74%; margin: auto;">
					<xfl-select 
					:list="list"
					:initValue="'汽油'"
					:isCanInput="false"  
					:clearable="false"
					:style_Container="listBoxStyle"
					@change="selectChange"
					>
					</xfl-select>
				</view>
			</view>
			<view>
				<text>加油量/L：</text>
				<input type="number" :clearBtn="true" :disabled="false" v-model.lazy="FuelingCapacity"  placeholder="请输入加油量"/>
			</view>
			<view>
				<text>燃价：</text>
				<input type="number" :clearBtn="true" :disabled="false" v-model.lazy="OilPrice"  placeholder="请输入油价"/>
			</view>
			<view>
				<text>加油金额：</text>
				<input disabled type="number" v-model.lazy="formData.datas[0].sum"  placeholder="加油金额"/>
			</view>
			<view>
				<text>选择加燃时间</text>
				<view>
					<uni-calendar
					v-model="formData.datas[0].ReportingTime"
					ref="calendar"
					:insert="false"
					@confirm="confirm"
					 ></uni-calendar>
					 <text class="dakai" @click="open">{{isCalendar ? '打开日历' : calendarDate}}</text>
				</view>
			</view>
		</view>
		<view class="subBtn-box">
			<button @click="service()">提交</button>
		</view>
	</view>
</template>

<script>
	import xflSelect from '@/components/xfl-select/xfl-select.vue';
	import uniCalendar from "@/components/uni-calendar/uni-calendar";
	export default {
		components: { xflSelect,uniCalendar },
		data(){
			return {
				listBoxStyle: `height: 80upx;`,
				list: [	//要展示的数据
					'汽油',
					'天然气',
					'柴油'
				],
				// 日历显示
				isCalendar:true,
				calendarDate:'',
				//接口 add_vehicleRepair
				 FuelingCapacity: "", // 解决watch 里面 名字不能 this.dromData.datas[0].FuelingCapacity
				 OilPrice: "",
				 sum: "",
				formData: {
				  datas: [
				    {
					id: "",
					uid: "",
					schoolcode: "",
					cphm: "", //车牌号
					coach: "", //教练名称
					FuelingCapacity: "", //加燃量
					OilPrice: "", //单价
					//sum: "",
					ReportingTime: "", //加油时间
					Fueltype: "0", //下拉框  燃料类型
					carnumber: "",  //车辆ID
				    }
				  ]
				},
				// 查询车牌号
				formData02: {
				  datas: [
				    {
				      uid: "",
				      schoolcode: ""
				    }
				  ]
				},
				carList:[],
				con:'',
				flag:false
				
			}
		},
		created() {
			//如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
			// this.formData.datas[0].wxstate = this.couponList[0].id;
			//接口 add_vehicleRepair
			this.datas = JSON.parse(uni.getStorageSync('datas'));
			this.formData.datas[0].id = this.datas[0].id;    
			this.formData.datas[0].uid = this.datas[0].uid;
			//console.log(this.datas);
		    this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			//接口 car
			this.formData02.datas[0].uid = this.datas[0].uid;
			this.formData02.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			this.carShow()
		},
		methods:{
			// 选择框发生变化时
			selectChange({index, orignItem}){ 
				this.formData.datas[0].wxstate = index
			},
			// 打开日历
			open(){
				this.$refs.calendar.open();
			},
			// 日历选择后
			confirm(e) {
				this.calendarDate = e.fulldate
				this.formData.datas[0].ReportingTime = e.fulldate
				this.isCalendar = false
			},
			// 提交
			service(){
				this.formData.datas[0].FuelingCapacity = this.FuelingCapacity; //加燃量
				this.formData.datas[0].OilPrice = this.OilPrice; //单价
				if (this.formData.datas[0].LicensePlateNumber === "") {
					 uni.showToast({title: "车牌号不能为空",icon:'none'})
					return;
				  } else if (this.formData.datas[0].coach === "") {
					uni.showToast({title: "教练姓名不能为空",icon:'none'})
					return;
				  } else if (this.formData.datas[0].FuelingCapacity === "") {
					uni.showToast({title: "加燃量不能为空",icon:'none'})
					return;
				  } else if (this.formData.datas[0].OilPrice === "") {
					uni.showToast({title: "燃价不能为空",icon:'none'})
					return;
				  } else if (this.formData.datas[0].ReportingTime === "") {
					  uni.showToast({title: "选择加燃时间不能为空",icon:'none'})
					return;
				  }
				
				uni.request({
					url:this.$ip.url.ip1 + '/app/menmian-area/4QAAAAEBAB4/add_fuelReport',
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code!==200){
							uni.showToast({title: msg,icon:'none'})
							return;
						}
						uni.showToast({title: '提交成功',icon:'none'})
						uni.redirectTo({
							url:'/pages/views/coachHome/carFuel/carFuel'
						})
					}
				})
				
			},
			// 获取车牌信息
			carShow(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/car",
					method:'post',
					data:JSON.stringify(this.formData02),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code==200){
							this.carList = datas
							console.log(this.carList)
						}
					}
				})
			},
			// 选择车牌号
			gotoItem(item) {
				var self = this;
				this.formData.datas[0].cphm = item.cphm;
				this.con = item.cphm;
				this.formData.datas[0].carnumber = item.carnumber;
				console.log(this.con);
				this.$nextTick(function () {
					self.flag = false
				})
			},
		},
		computed: {
				//过滤方法
			items() {
				if (this.con == '') {
					return;
				}
				return this.carList.filter(value => value.cphm.indexOf(this.con) !== -1)
			}
		},
		watch: {
			con:function(val){
				if(val){
					this.flag=true;
				}else{
					this.flag=false;
				}
			},
		 FuelingCapacity(val) {
			  this.formData.datas[0].sum = this.FuelingCapacity * this.OilPrice;
			  this.formData.datas[0].sum = this.formData.datas[0].sum.toFixed(2) + "";
			  console.log(this.FuelingCapacity);
			  if (isNaN(this.formData.datas[0].sum)) {
				this.formData.datas[0].sum = "";
			  }
			},
			OilPrice(val) {
			  this.formData.datas[0].sum = this.FuelingCapacity * this.OilPrice;
			  this.formData.datas[0].sum = this.formData.datas[0].sum.toFixed(2) + "";
			  console.log(this.OilPrice);
			  //console.log(typeof this.formData.datas[0].sum);
			  if (isNaN(this.formData.datas[0].sum)) {
				this.formData.datas[0].sum = "";
			  }
			}
		}
	}
</script>

<style>
	page{
		padding: 0 30upx;
		box-sizing: border-box;
	}
	.box {
		padding: 30upx 0;
	}
	.form-box>view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		padding: 30upx 10upx;
		border-bottom: 2upx solid #E9E9E9;
	}
	.form-box>view text {
		flex: 1;
	}
	.form-box>view input,
	.form-box>view .dakai{
		width: 74%;
		font-size: 28upx;
	}
	.form-box .lash {
		align-items: flex-start;
		flex-direction: column;
		border: none;
	}
	.form-box .lash textarea{
		width: 100%;
		font-size: 28upx;
		border: 2upx solid #ccc;
		border-radius: 10upx;
		height: 180upx;
		margin-top: 20upx;
		padding: 14upx;
		box-sizing: border-box;
	}
	.subBtn-box {
		padding: 30upx 0;
	}
	.subBtn-box button{
		background-color: #00BB99;
		/* border-radius: 60upx; */
		color: #FFFFFF;
	}
	/* 搜搜 */
	.carHao {
		position: relative;
	}
	.carHao .sos-box {
		position: absolute;
		left: 50%;
		top: 120upx;
		transform: translate(-50%);
		background: #fff;
		font-size: 28upx;
		text-align: center;
		border-radius: 10upx;
		border: 1px solid #dcdfe6;
		box-shadow: 0 4upx 24upx 0 rgba(0, 0, 0, 0.1);
		padding: 10upx 0;
		width: 50%;
		z-index: 99;
	}
	.carHao .sos-box::before {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		border-top: 1px solid #ccc;
		border-left: 1px solid #ccc;
		transform: rotate(45deg);
		top: -6px;
		left: 20%;
		background: #fff;
		z-index: 99999999999;
	}
	.carHao .soso{
		padding: 0;
		list-style: none;
		max-height: 300px;
		overflow: scroll;
	}
	.carHao .soso>li{
	   color: #00BB99;
	   font-weight: 700;
	   padding:20upx 0;
	}	
	.carHao .soso>li:hover{
	  background:#ECECEC;
	}
</style>
