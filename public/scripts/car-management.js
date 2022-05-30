const deleteCarSetupBtnElements = document.querySelectorAll('.card-actions button');

const deleteCarSetup = async (event) => {
  const confirmation = confirm('Are you sure you want to delete this setup?');

  if (!confirmation) {
    return;
  }
  
  const buttonEle = event.target;
  const carSetupId = buttonEle.dataset.carsetupid;
  const csrfToken = buttonEle.dataset.csrf;

  const response = await fetch(`/mysetups/${carSetupId}?_csrf=${csrfToken}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    alert('Something went wrong');
    return;
  }

  buttonEle.parentElement.parentElement.parentElement.remove();
}

for (const deleteCarSetupBtnEle of deleteCarSetupBtnElements) {
  deleteCarSetupBtnEle.addEventListener('click', deleteCarSetup);
}