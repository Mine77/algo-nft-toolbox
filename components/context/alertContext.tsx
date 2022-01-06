import { createContext, useState } from 'react';


enum AlertStatus {
    Success = "SUCCESS",
    Error = "ERROR",
    None= "NONE"
}

interface AlertAPI {
    alert:string,
    alertText: string,
    success: (text:string,timeout?:number) => void,
    error: (text:string,timeout?:number) => void,
    clear: ()=>void
}

const AlertContext = createContext<AlertAPI>(null);
AlertContext.displayName = 'AlertContext';

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(AlertStatus.None);
  const [alertText, setAlertText] = useState(null);

  return (
    <AlertContext.Provider
      value={{
        alert: alert,
        alertText: alertText,
        success: (text: string, timeout: number = 10) => {
          setAlertText(text);
          setAlert(AlertStatus.Success);
          // setTimeout(() => {
          //   setAlert(AlertStatus.None);
          // }, timeout * 1000)

        },
        error: (text: string, timeout: number = 10) => {
          setAlertText(text);
          setAlert(AlertStatus.Error);
          // setTimeout(() => {
          //   setAlert(AlertStatus.None);
          // }, timeout * 1000)
        },
        clear: () => (setAlert(AlertStatus.None)),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export { AlertProvider };
export default AlertContext;