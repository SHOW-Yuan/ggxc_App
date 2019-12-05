<template>
	<view class="status_bar">
		<view ref="bacg" id="bacg" :class="{tab:bacg}">
			<view class="tabOne">
			<wuc-tab  class="tab1" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" ></wuc-tab>
			</view>
			
			<view v-if="TabCur==0"  class="tabTab1">
			<view class="tab1-sub">
				<view>
					<text>科目一代考</text>
					<button>立即约考</button>
				</view>
				<view>
					<text>科目二代考</text>
					<button>立即约考</button>
				</view>
				<view>
					<text>科目三代考</text>
					<button>立即约考</button>
				</view>
				<view>
					<text>科目四代考</text>
					<button>立即约考</button>
				</view>
			</view>
			<view class="tab1-bottom">
				<h3>皮皮</h3>
				<h4>21</h4>
				<p>A1</p>
				<navigator url="/pages/views/Home/myEvaluate/myEvaluate">
					<button>我的评价</button>
				</navigator>
			</view>
			<navigator url="/pages/views/Home/trainMake/trainMake">
				<image src="../../../static/images/5_03.png" class="bottomImg" mode=""></image>
			</navigator>
			</view>
			<view  v-else class="tab2" >
				<view></view>
			</view>
		</view>
	</view>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	export default {
		components: { WucTab},
		data() {
			return {
				bacg:true,
				TabCur: 0,
				tabList: [{ name: '考试成绩' },{ name: '计时查询' }],
			}
		},
		methods: {
			// tab切换
			tabChange(index){
				if(index==0){
					this.bacg=true
				}else{
					this.bacg=false
				}
			},
			// 跳转到我的评价
			
		}
	}
</script>

<style>

#bacg{
	position: absolute;
	width:100%;
	height:100%;
	background-color: #fafafa;
}
.tab{
	background: url(../../../static/images/66_03.0ab0440.jpg) no-repeat;
	background-size: 100% 100%;
}
.tabOne{
	width:100%;
	box-sizing: border-box;
	padding:0 20upx;
	margin-top:30upx;
	text-align: center;
}
.tab1-sub{
	width: 100%;
	padding:50upx  30upx 0 30upx;
	box-sizing: border-box;
	display: flex; 
	flex-wrap:wrap;
	justify-content:space-between;
	height:640upx;
}
.tab1-sub view{
	width:330upx;
	height:270upx;
	box-sizing: border-box;
	background: #ffffff;
	border-radius:15upx;
	padding:20upx;
	font-size:31upx;
}
.tab1-sub view button{
	width:100%;
	height:70upx;
	border-radius:7upx;
	background: #08BCA1;
	font-size:24upx;
	line-height: 70upx;
	color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top:50upx;
}
.tab1-bottom{
	width:100%;
	height:300upx;
	margin-top: 200upx;
	color:#fff;
	box-sizing: border-box;
	padding-left:25upx;
}
.tab1-bottom h3{
	font-size:34upx;
	margin-bottom:4upx;
}
.tab1-bottom h4{
	font-size:30upx;
}
.tab1-bottom p{
	background: #08BCA1;
	font-size:24upx;
	width:65upx;
	height:30upx;
	border-radius:4upx;
	line-height:30upx;
	text-align: center;
	margin-top:10upx;
}
.tab1-bottom button{
	background: url(../../../static/images/xzb.png) no-repeat 16% center;
	background-size:50upx;
	background-color: #08BCA1;
	color:#fff;
	width:240upx;
	height:60upx;
	line-height:55upx;
	font-size:24upx;
	border-radius:100upx;
	float: left;
	margin-top:60upx;
	box-sizing: border-box;
	padding-left:50upx;
}
.bottomImg{
	width:215upx;
	height:215upx;
	position: absolute;
	right: 0;
	bottom: 0;
	margin-right:50upx;
}
.tab2{
	
}
</style>
