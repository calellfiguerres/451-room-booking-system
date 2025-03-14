import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("logout", "routes/logout.tsx"),
    route("signup", "routes/signup.tsx"),
    route("usersList", "routes/usersList.tsx"),
] satisfies RouteConfig;
