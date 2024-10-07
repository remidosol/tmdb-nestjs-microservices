import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie, MovieDocument } from "./schemas";
import { OrderQuery } from "../common/filter";

@Injectable()
export class MovieRepository {
  constructor(
    @InjectModel(Movie.name) private MovieModel: Model<MovieDocument>,
  ) {}

  async save(receivedMovie: Movie): Promise<Movie> {
    const movie = await this.MovieModel.create(receivedMovie);
    return movie.save();
  }

  async findAll(order?: OrderQuery<Movie>): Promise<Movie[]> {
    return this.MovieModel.find({}, undefined, { sort: order ?? {} }).exec();
  }

  async findById(id: string): Promise<Movie | null> {
    return this.MovieModel.findOne({ id }).exec();
  }

  async removeById(id: string): Promise<void> {
    await this.MovieModel.findOneAndDelete({ id }).exec();
  }
}
