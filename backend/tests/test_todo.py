from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
import time
import requests

class TodoAppTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.get("http://localhost:3000/login")  # Adjust the URL to your local development server

    def test_login(self):
        driver = self.driver
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "form2Example17")))
        time.sleep(1)

        email_input = driver.find_element(By.ID, "form2Example17")
        email_input.send_keys("testuser1@aol.com")
        time.sleep(1)

        password_input = driver.find_element(By.ID, "form2Example27")
        password_input.send_keys("p@ssword123")
        time.sleep(1)

        password_input.send_keys(Keys.RETURN)
        time.sleep(1)

    def test_add_todo(self):
        driver = self.driver
        self.test_login()  # Ensure the user is logged in before adding a todo
        driver.get("http://localhost:3000/todo")  # Navigate to the todo page
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "todo-input")))
        time.sleep(5)

        todo_input = driver.find_element(By.ID, "todo-input")
        todo_input.send_keys("Test Todo")
        time.sleep(1)

        todo_input.send_keys(Keys.RETURN)
        time.sleep(1)


        
        progress_button = driver.find_element(By.CSS_SELECTOR, ".btn.bg-info")
        progress_button.click()
        time.sleep(1)
        progress_button.click()
        time.sleep(1)
        
        success_button = driver.find_element(By.CSS_SELECTOR, ".btn.bg-success")
        success_button.click()
        time.sleep(1)
        success_button.click()
        time.sleep(1)        

        delete_button = driver.find_element(By.CSS_SELECTOR, ".btn.bg-danger")
        delete_button.click()
        time.sleep(1)
        
        WebDriverWait(driver, 10).until(EC.invisibility_of_element_located((By.CLASS_NAME, "swal2-popup")))

        logout_button = driver.find_element(By.ID, "logout")
        logout_button.click()
        time.sleep(2)
        self._delete_user()

    def _delete_user(self):
        # Example API call to delete the user
        response = requests.delete("http://127.0.0.1:8000/api/delete-user/", data={"email": "testuser1@aol.com"})
        assert response.status_code == 204  

    def tearDown(self):
        
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()