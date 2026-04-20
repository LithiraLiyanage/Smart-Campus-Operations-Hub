package backend;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Explicit MongoDB configuration.
 *
 * Spring Boot 4.x auto-configuration does not reliably parse mongodb+srv://
 * URIs through the spring.data.mongodb.uri property when combined with the
 * sync MongoDB driver 5.x — the auto-configured MongoClient falls back to
 * localhost:27017. This bean takes full control of MongoClient creation,
 * reading the URI directly from application.properties and constructing
 * MongoClientSettings explicitly so the SRV DNS lookup and Atlas TLS
 * handshake work correctly.
 */
@Configuration
@EnableMongoRepositories(basePackages = "backend.Repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:paf_db}")
    private String databaseName;

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .build();
        return MongoClients.create(settings);
    }

    // Disable automatic index creation to avoid extra startup queries
    @Override
    protected boolean autoIndexCreation() {
        return false;
    }
}
