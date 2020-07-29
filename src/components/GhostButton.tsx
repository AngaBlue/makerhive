import React from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/lib/button/button";
import styles from "./GhostButton.module.less";

export default function GhostButton(props: ButtonProps) {
    return <Button type="ghost" {...props} className={[styles.button, props.className || ""].join(" ")}/>;
}
