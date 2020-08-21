import * as React from "react";
import ReactDom from "react-dom";
import {Button} from 'antd'

ReactDom.render(
  <Button type='primary'>click</Button>,
  document.getElementById("app")
);