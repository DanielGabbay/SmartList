FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs
RUN npm install -g @angular/cli
RUN npm install -g nx@latest

FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SmartList.Server/SmartList.Server.csproj", "SmartList.Server/"]
COPY ["smartlist.client/smartlist.client.esproj", "smartlist.client/"]
RUN dotnet restore "./SmartList.Server/SmartList.Server.csproj"
COPY . .
WORKDIR "/src/SmartList.Server"
RUN dotnet build "./SmartList.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SmartList.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Client build
FROM with-node AS client-build
WORKDIR /src
COPY ["smartlist.client/", "/src/smartlist.client/"]
WORKDIR /src/smartlist.client
RUN npm install --force
RUN npm run build

# Copy client dist folder to the final stage
# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=client-build /src/smartlist.client/dist/main ./wwwroot/main
COPY --from=client-build /src/smartlist.client/dist ./wwwroot
ENTRYPOINT ["dotnet", "SmartList.Server.dll"]
