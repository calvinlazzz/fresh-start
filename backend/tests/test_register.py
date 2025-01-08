from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
import time

class TodoRegisterTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.get("http://localhost:3000/register")  # Adjust the URL to your local development server

    def test_register(self):
        driver = self.driver
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "form2Example17")))
        time.sleep(1)

        email_input = driver.find_element(By.ID, "form2Example17")
        email_input.send_keys("testuser1@aol.com")
        time.sleep(1)

        username_input = driver.find_element(By.ID, "form2Example27")
        username_input.send_keys("testuser1")
        time.sleep(1)
        
        password_input = driver.find_element(By.ID, "form2Example37")
        password_input.send_keys("p@ssword123")
        time.sleep(1)
        
        confirm_password_input = driver.find_element(By.ID, "form2Example47")
        confirm_password_input.send_keys("p@ssword123")
        time.sleep(1)

        password_input.send_keys(Keys.RETURN)
        time.sleep(1)
        

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()