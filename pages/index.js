import React from 'react';
import withRedux from 'next-redux-wrapper';
import 'isomorphic-unfetch';

import {
	connect
} from 'react-redux';

import {
	Layout,
	Table,
	Card,
	Menu,
	notification,
	Badge,
	Alert
} from 'antd';
const {
	Header,
	Footer,
	Sider,
	Content
} = Layout;

import {
	bindActionCreators
} from 'redux';

import NProgress from 'nprogress';

import Head from 'next/head'; // 引入内置组件
import Link from 'next/link';
import {
	withRouter
} from 'next/router';

//socket.io api
import io from 'socket.io-client';

const cookieParser = require("cookie-parser");

import initializeStore from '../store/initializeStore';
import * as actionCreators from './actions';


class Index extends React.Component {
	static async getInitialProps({
		query,
		store,
		isServer
	}) {

		if (isServer == false) {
			NProgress.start();
		}
		console.log(11);
		// global.token = 'aaa';

		let data = store.getState();

		let params = {
			limit: data.limit,
			offset: 1
		}
		await store.dispatch(actionCreators.getTables(params));

	}

	constructor(props) {
		super(props);

		this.state = {
			number: 0
		}
	}


	componentWillMount() {



	}

	componentDidMount() {
		if (document != undefined) {
			NProgress.done();
		}

		var that = this;


		let socket = io('http://localhost:3000');
		socket.on('client/1234', function(obj) {
			notification['success']({
				message: obj.msg.note,
				description: obj.msg.gender,
			});
		})

		socket.on('num', function(obj) {
			that.setState({
				number: obj.msg
			})
		})

	}

	addKey(data, str) {
		var arr = [];

		data.map((v, k) => {
			v.key = str + k;
			arr.push(v);
		});

		return arr;
	}

	handleTableChange(pagination, filters, sorter) {
		let params = {

			offset: pagination.current,
			limit: pagination.pageSize
		}

		this.props.getTables(params);
	}

	render() {

		var pagination = {
			current: this.props.index.offset,
			pageSize: this.props.index.limit,
			total: this.props.index.total
		}

		this.addKey(this.props.index.tableData, 'index' + new Date().getTime());

		return (
			<div>
			    <Head>
					<title>通知和通知提醒</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
					<link rel="stylesheet" href="/static/antd.css" />
					<link rel="stylesheet" href="/static/index.css" />
				</Head>
				<Layout>
					<Header style={{color:"white"}}>
					<div className="logo" >websocket json文本传输</div>
				      <Menu
				        theme="dark"
				        mode="horizontal"
				        selectedKeys={['1']}
				        style={{ lineHeight: '64px', float:'left' }}
				      >
				        <Menu.Item key="1">前台页面</Menu.Item>
				        <Menu.Item key="2"><Link href='/about'><a>后台页面</a></Link></Menu.Item>
				      </Menu>
				      <div style={{float:"right"}}>
								 	<Badge count={this.state.number} showZero>
								      <a href="#" className="head-example" />
								    </Badge>
								</div>
					</Header>

					<Content>
						<div style={{ background: '#f2f2f2',padding: '30px' }}>

							<Alert
						      message="通知和通知提醒 demo"
						      description="后台地址: http://localhost:3000/about"
						      type="warning"
						      showIcon
						    />
						  
	  					</div>
						
					</Content>
					<Footer>Footer</Footer>

				</Layout>
			</div>
		)
	}
}

//将state.counter绑定到props的counter
const mapStateToProps = (state) => {
	return {
		index: state.About
	}
};

//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch, ownProps) => {
	//全量
	return bindActionCreators(actionCreators, dispatch);
};

Index = connect(mapStateToProps, mapDispatchToProps)(Index);

Index = withRedux(initializeStore)(Index);

export default withRouter(Index);