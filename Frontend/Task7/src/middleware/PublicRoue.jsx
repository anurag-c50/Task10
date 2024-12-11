import { Navigate } from 'react-router-dom';

export default function PublicRoute({ element,redirectTo}){
  const isAuth = () => {return !!localStorage.getItem('Auth')}
  console.log(isAuth())
  return !isAuth() ? element : <Navigate to={redirectTo}/>
};
