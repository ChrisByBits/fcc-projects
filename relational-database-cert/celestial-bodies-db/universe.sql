CREATE DATABASE universe;

\c universe;

CREATE TABLE galaxy (
    galaxy_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    galaxy_type TEXT,
    distance_from_earth NUMERIC(10, 2),
    age_in_millions_of_years INT,  -- Changed to INT
    UNIQUE (name)
);

CREATE TABLE star (
    star_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_spherical BOOLEAN,
    age_in_millions_of_years INT,
    galaxy_id INT REFERENCES galaxy(galaxy_id),
    distance_from_earth INT,
    UNIQUE (name, galaxy_id)
);

CREATE TABLE planet (
    planet_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    planet_type VARCHAR(255),
    has_life BOOLEAN,
    star_id INT REFERENCES star(star_id),
    distance_from_earth INT,
    age_in_millions_of_years INT,
    UNIQUE (name, star_id)
);

CREATE TABLE moon (
    moon_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_spherical BOOLEAN,
    distance_from_earth INT,
    planet_id INT REFERENCES planet(planet_id),
    age_in_millions_of_years INT,
    UNIQUE (name, planet_id)
);

CREATE TABLE planetary_system (
  planetary_system_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  star_id INT REFERENCES star(star_id),
  number_of_planets INT NOT NULL,
  average_distance_from_star NUMERIC(10, 2),
  average_orbital_period INT NOT NULL,
  average_mass_of_planets NUMERIC(10, 2),
  UNIQUE (star_id)
);

INSERT INTO galaxy (name, galaxy_type, distance_from_earth, age_in_millions_of_years) VALUES
    ('Milky Way', 'Spiral', 100000.45, 13000),
    ('Andromeda', 'Spiral', 150000.78, 12000),
    ('Triangulum', 'Irregular', 200000.12, 10000),
    ('Messier 87', 'Elliptical', 500000.89, 13000),
    ('Sombrero', 'Spiral', 600000.34, 11000),
    ('Whirlpool', 'Spiral', 300000.67, 12000);

INSERT INTO star (name, is_spherical, age_in_millions_of_years, galaxy_id, distance_from_earth) VALUES
    ('Sun', TRUE, 4600, 1, 0),
    ('Proxima Centauri', TRUE, 6000, 1, 4.24),
    ('Alpha Centauri A', TRUE, 5000, 1, 4.37),
    ('Betelgeuse', TRUE, 8000, 2, 500),
    ('Sirius', TRUE, 3000, 1, 8.6),
    ('Antares', TRUE, 6000, 3, 550);

INSERT INTO planet (name, planet_type, has_life, star_id, distance_from_earth, age_in_millions_of_years) VALUES
    ('Earth', 'Terrestrial', TRUE, 1, 0, 4.5),
    ('Mars', 'Terrestrial', FALSE, 1, 0, 4.6),
    ('Jupiter', 'Gas Giant', FALSE, 2, 0, 4.5),
    ('Saturn', 'Gas Giant', FALSE, 2, 0, 4.5),
    ('Neptune', 'Ice Giant', FALSE, 4, 0, 4.5),
    ('Uranus', 'Ice Giant', FALSE, 4, 0, 4.5),
    ('Venus', 'Terrestrial', FALSE, 1, 0, 4.5),
    ('Mercury', 'Terrestrial', FALSE, 1, 0, 4.5),
    ('Pluto', 'Dwarf Planet', FALSE, 5, 0, 4.5),
    ('Kepler-186f', 'Exoplanet', TRUE, 6, 0, 4.5),
    ('HD 209458 b', 'Exoplanet', FALSE, 6, 0, 4.5),
    ('55 Cancri e', 'Exoplanet', FALSE, 6, 0, 4.5);

INSERT INTO moon (name, is_spherical, distance_from_earth, planet_id, age_in_millions_of_years) VALUES
    ('Luna', TRUE, 384400, 1, 4.5),
    ('Phobos', TRUE, 9378, 2, 4.6),
    ('Deimos', TRUE, 23456, 2, 4.6),
    ('Titan', TRUE, 1221875, 4, 4.5),
    ('Europa', TRUE, 671034, 3, 4.5),
    ('Ganymede', TRUE, 1070400, 3, 4.5),
    ('Callisto', TRUE, 1882700, 3, 4.5),
    ('Triton', TRUE, 354759, 5, 4.5),
    ('Enceladus', TRUE, 147909, 4, 4.5),
    ('Titania', TRUE, 435910, 6, 4.5),
    ('Oberon', TRUE, 583520, 6, 4.5),
    ('Iapetus', TRUE, 3560840, 4, 4.5),
    ('Rhea', TRUE, 527040, 4, 4.5),
    ('Dione', TRUE, 377396, 4, 4.5),
    ('Hyperion', TRUE, 1481100, 4, 4.5),
    ('Miranda', TRUE, 129780, 5, 4.5),
    ('Ariel', TRUE, 191020, 5, 4.5),
    ('Umbriel', TRUE, 266300, 5, 4.5),
    ('Nereid', TRUE, 5513816, 5, 4.5),
    ('Phobos-1', TRUE, 10000, 7, 4.5),
    ('Phobos-2', TRUE, 20000, 7, 4.5),
    ('Deimos-1', TRUE, 5000, 8, 4.5),
    ('Charon', TRUE, 19500, 8, 4.5),
    ('Phobos-3', TRUE, 10000, 7, 4.5);

INSERT INTO planetary_system (name, star_id, number_of_planets, average_distance_from_star, average_orbital_period, average_mass_of_planets) VALUES
    ('Solar System', 1, 8, 0.5, 100, 1),
    ('Alpha Centauri System', 2, 2, 1.5, 200, 10),
    ('Kepler-186 System', 3, 3, 5, 300, 100),
    ('TRAPPIST-1 System', 4, 4, 10, 400, 1000),
    ('55 Cancri System', 5, 5, 20, 500, 10000);
