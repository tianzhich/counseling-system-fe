import { history } from "./history";
import App from "../features/home/App";
import { Component } from "react";
import { RouteProps } from "react-router";

export interface IRoute {
    path: string
    component?: RouteProps['component']
    childRoutes?: IRoute[]
}

const childRoutes: IRoute[] = []

const routes = [{
    path: '/',
    component: App,
    childRoutes
}]

export default routes;