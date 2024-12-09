import { Navigate } from 'react-router-dom';

export default function PublicRoute({ element,redirectTo}){
  const isAuth = () => {return !!localStorage.getItem('Auth')}
  return !isAuth() ? element : <Navigate to={redirectTo}/>
};
