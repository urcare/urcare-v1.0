// Responsive layout utilities for onboarding components

export const ONBOARDING_RESPONSIVE_CLASSES = {
  // Container classes
  container: "w-full max-w-md px-2 sm:px-0",
  scrollContainer: "flex-1 flex flex-col px-4 sm:px-6 pt-4 overflow-y-auto",
  
  // Header classes
  header: "flex items-center justify-between p-4 pt-12 flex-shrink-0",
  progressBar: "flex-1 mx-4 sm:mx-8",
  
  // Content classes
  content: "flex-1 flex items-start justify-center min-h-0",
  welcomeContent: "flex-1 flex items-center justify-center min-h-0",
  
  // Question/Title classes
  question: "mb-4 sm:mb-6 text-center flex-shrink-0",
  title: "text-lg sm:text-xl font-normal text-gray-900 mb-2 leading-tight px-2",
  
  // Button classes
  buttonContainer: "p-4 sm:p-6 pb-6 flex-shrink-0",
  continueButton: "w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl",
  
  // Input classes
  inputContainer: "w-full space-y-3",
  input: "w-full h-12 sm:h-14 text-base sm:text-lg px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
  label: "text-base sm:text-lg font-medium text-gray-900",
  error: "text-red-500 text-sm mt-2 px-1",
  
  // Choice/Button classes
  choiceContainer: "space-y-3 sm:space-y-4",
  choiceButton: "w-full p-4 sm:p-5 rounded-2xl border-2 border-gray-200 bg-white text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md",
  choiceButtonSelected: "border-blue-500 bg-blue-50 text-blue-900",
  choiceButtonText: "text-base sm:text-lg font-medium",
  choiceButtonDescription: "text-sm sm:text-base text-gray-600 mt-1",
  
  // Multi-choice classes
  multiChoiceContainer: "space-y-2 sm:space-y-3",
  multiChoiceItem: "flex items-center p-3 sm:p-4 rounded-xl border-2 border-gray-200 bg-white transition-all duration-200 hover:border-gray-300",
  multiChoiceItemSelected: "border-blue-500 bg-blue-50",
  multiChoiceCheckbox: "w-5 h-5 sm:w-6 sm:h-6 rounded border-2 border-gray-300 flex items-center justify-center transition-all duration-200",
  multiChoiceCheckboxSelected: "border-blue-500 bg-blue-500",
  multiChoiceText: "text-base sm:text-lg font-medium text-gray-900 ml-3 sm:ml-4",
  
  // Wheel picker classes
  wheelPickerContainer: "h-48 sm:h-56 overflow-hidden flex flex-col justify-center focus:outline-none rounded-xl",
  wheelPickerItem: "flex items-center justify-center cursor-pointer transition-all duration-300 ease-out px-1 sm:px-2",
  wheelPickerText: "select-none text-center leading-tight pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis max-w-full",
  
  // Welcome step classes
  welcomeContainer: "text-center w-full",
  welcomeIcon: "w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6",
  welcomeTitle: "text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 px-2",
  welcomeDescription: "text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 px-2",
  welcomeCard: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100 mx-2",
  welcomeCardContent: "text-xs sm:text-sm text-gray-600"
};

// Responsive spacing utilities
export const RESPONSIVE_SPACING = {
  section: "space-y-4 sm:space-y-6",
  item: "space-y-2 sm:space-y-3",
  button: "space-x-2 sm:space-x-4",
  padding: "p-4 sm:p-6",
  margin: "m-4 sm:m-6"
};

// Responsive text utilities
export const RESPONSIVE_TEXT = {
  title: "text-lg sm:text-xl",
  subtitle: "text-base sm:text-lg",
  body: "text-sm sm:text-base",
  caption: "text-xs sm:text-sm",
  large: "text-xl sm:text-2xl"
};

// Responsive sizing utilities
export const RESPONSIVE_SIZING = {
  icon: "w-5 h-5 sm:w-6 sm:h-6",
  button: "h-10 sm:h-12",
  input: "h-12 sm:h-14",
  container: "max-w-sm sm:max-w-md"
};

// Helper function to get responsive classes
export const getResponsiveClass = (baseClass: string, responsiveClass: string) => {
  return `${baseClass} ${responsiveClass}`;
};

// Helper function for conditional responsive classes
export const getConditionalResponsiveClass = (
  condition: boolean,
  trueClass: string,
  falseClass: string
) => {
  return condition ? trueClass : falseClass;
}; 