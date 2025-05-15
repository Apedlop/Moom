import React from "react";
import Toast from "react-native-toast-message"; // Importa la librería de Toast

// Componente de Toast personalizado
const ToastMessage = ({ message }) => {
  const showToast = () => {
    Toast.show({
      type: 'success', // Puedes cambiar el tipo a 'error', 'info', etc.
      position: 'top',  // Posición del Toast, puede ser 'top', 'bottom'
      text1: message,   // El mensaje que se pasará como prop
      visibilityTime: 3000,  // El tiempo que el Toast permanecerá visible
    });
  };

  // Mostrar el toast al cargar el componente
  React.useEffect(() => {
    showToast();
  }, [message]);

  return null; // Este componente no renderiza nada por sí mismo
};

export default ToastMessage;
