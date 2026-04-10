class SwaggerController < ActionController::Base
  def index
  end

  def openapi
    yaml_path = Rails.root.join("../openapi.yaml")
    if yaml_path.exist?
      send_file yaml_path, type: "application/yaml", disposition: "inline"
    else
      head :not_found
    end
  end
end
