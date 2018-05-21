import React, {Component} from "react";
import PropTypes from "prop-types";
import RichTextEditor from "react-rte";
export default class MyStatefulEditor extends Component {
	render () {
		return (
			<RichTextEditor
				placeholder="Type the title"
				value={this.props.title}
				onChange={this.props.onChange}
			/>
		);
	}
}