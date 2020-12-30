using NUnit.Framework;

namespace goodurls.tests
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestPassingTest()
        {
            var message = HelloWorld.GetMessage();
            Assert.AreEqual("Hello World", message);
            
        }
    }
}