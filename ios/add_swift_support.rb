require 'xcodeproj'

project_path = 'MarutiSuzukiApp.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main app target
target = project.targets.find { |t| t.name == 'MarutiSuzukiApp' }

if target
  # Add Swift version and enable Swift
  target.build_configurations.each do |config|
    config.build_settings['SWIFT_VERSION'] = '5.0'
    config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'YES'
    config.build_settings['CLANG_ENABLE_MODULES'] = 'YES'
  end

  # Create a bridging header
  bridging_header_path = '$(SRCROOT)/MarutiSuzukiApp/MarutiSuzukiApp-Bridging-Header.h'
  target.build_configurations.each do |config|
    config.build_settings['SWIFT_OBJC_BRIDGING_HEADER'] = 'MarutiSuzukiApp/MarutiSuzukiApp-Bridging-Header.h'
  end

  # Add the Swift file to the project
  swift_file_ref = project.main_group.find_file_by_path('MarutiSuzukiApp/Dummy.swift')
  unless swift_file_ref
    swift_file_ref = project.main_group['MarutiSuzukiApp'].new_file('MarutiSuzukiApp/Dummy.swift')
  end
  target.add_file_references([swift_file_ref])

  project.save
  puts "Swift support added successfully!"
else
  puts "Target 'MarutiSuzukiApp' not found!"
end
