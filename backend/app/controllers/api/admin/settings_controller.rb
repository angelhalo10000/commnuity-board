module Api
  module Admin
    class SettingsController < Api::Admin::BaseController
      def show
        render json: { organization_name: current_organization.name }
      end

      def member_password
        org = current_organization
        unless org.authenticate_member_password(params[:current_password].to_s)
          return render_errors([ "現在のパスワードが正しくありません" ], status: :unprocessable_entity)
        end

        if org.update(member_password: params[:password])
          head :no_content
        else
          render_errors(org.errors.full_messages)
        end
      end

      def leader_password
        org = current_organization
        unless org.authenticate_leader_password(params[:current_password].to_s)
          return render_errors([ "現在のパスワードが正しくありません" ], status: :unprocessable_entity)
        end

        if org.update(leader_password: params[:password])
          head :no_content
        else
          render_errors(org.errors.full_messages)
        end
      end

      def admin_password
        org = current_organization
        unless org.authenticate_admin_password(params[:current_password].to_s)
          return render_errors([ "現在のパスワードが正しくありません" ], status: :unprocessable_entity)
        end

        if org.update(admin_password: params[:password])
          head :no_content
        else
          render_errors(org.errors.full_messages)
        end
      end

      def organization
        if current_organization.update(name: params[:name])
          head :no_content
        else
          render_errors(current_organization.errors.full_messages)
        end
      end
    end
  end
end
